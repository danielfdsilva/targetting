import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';
import cloneDeep from 'lodash.clonedeep';
import { arraySort } from '../../utils/array';

const clamper = (min, max) => val => Math.max(min, Math.min(val, max));

class Target extends Component {
  constructor (props) {
    super(props);

    this.container = React.createRef();

    this.chart = null;
  }

  componentDidMount () {
    // console.log('ChartMeasurement componentDidMount');
    // Debounce event.
    this.onWindowResize = debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = Chart();
    this.chart
      .rings(this.props.rings)
      .arrow(this.props.arrow)
      .hitPosition(this.props.hitPosition)
      .registeredHits(this.props.hits)
      .onHitChange(this.props.onHitChange);

    d3.select(this.container.current).call(this.chart);
  }

  componentDidUpdate (prevProps/* prevState */) {
    // console.log('ChartMeasurement componentDidUpdate');
    this.chart.pauseUpdate();
    if (prevProps.rings !== this.props.rings) {
      this.chart.rings(this.props.rings);
    }
    if (prevProps.arrow !== this.props.arrow) {
      this.chart.arrow(this.props.arrow);
    }
    if (prevProps.hitPosition !== this.props.hitPosition) {
      this.chart.hitPosition(this.props.hitPosition);
    }
    if (prevProps.onHitChange !== this.props.onHitChange) {
      this.chart.onHitChange(this.props.onHitChange);
    }
    if (prevProps.hits !== this.props.hits) {
      this.chart.registeredHits(this.props.hits);
    }
    this.chart.continueUpdate();
  }

  componentWillUnmount () {
    // console.log('ChartMeasurement componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  }

  onWindowResize () {
    this.chart.checkSize();
  }

  render () {
    return (
      <div ref={this.container} />
    );
  }
}

Target.propTypes = {
  rings: T.array,
  arrow: T.object,
  hitPosition: T.object,
  onHitChange: T.func
};

export default Target;

var Chart = function (options) {
  // Data related variables for which we have getters and setters.
  var _rings = null;
  var _arrow = null;
  var _hitPosition = null;
  var _registeredHits = null;
  var _onHitChange = () => {}; // noop

  // Pause
  var _pauseUpdate = false;

  // Containers
  var $el, $svg;

  // Var declaration.
  const margin = 16;

  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width;

  // Update functions.
  var updateData, updateSize;

  // Radius scale.
  var rScale = d3.scaleLinear();

  // Cartesian scale
  const cartesianX = d3.scaleLinear();
  const cartesianY = d3.scaleLinear();

  function _calcSize () {
    _width = parseInt($el.style('width'), 10) - margin * 2;
  }

  function chartFn (selection) {
    $el = selection;

    const layers = {
      // Target rings
      rings: () => {
        const ringsData = arraySort(_rings, 'radius');

        let ringsG = $dataCanvas.select('g.rings');
        if (ringsG.empty()) {
          ringsG = $dataCanvas.append('g').attr('class', 'rings');
        }

        const ringCircles = ringsG.selectAll('circle')
          .data(ringsData);

        ringCircles.exit().remove();

        ringCircles
          .enter()
          .append('circle')
          .merge(ringCircles)
          .attr('r', d => rScale(d.radius))
          .attr('cx', _width / 2)
          .attr('cy', _width / 2)
          .attr('fill', d => d.color)
          .attr('stroke', '#444')
          .attr('stroke-width', d => d.separator ? 2 : 1);
      },

      ghostRect: () => {
        let ghost = $dataCanvas.select('.interaction-rect');

        if (!_onHitChange) {
          if (!ghost.empty()) ghost.remove();
          return;
        }

        if (ghost.empty()) {
          ghost = $dataCanvas.append('rect')
            .attr('class', 'interaction-rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('opacity', 0)
            .on('click', function (d) {
              const [xPos, yPos] = d3.mouse(this);
              const point = {
                cx: cartesianX(xPos),
                cy: cartesianY(yPos)
              };
              // Click only triggers the first.
              if (!_hitPosition) {
                _onHitChange(point);
              }
            });
        }

        ghost
          .attr('cursor', () => _hitPosition ? 'default' : 'crosshair')
          .attr('width', _width)
          .attr('height', _width);
      },

      interactiveArrow: () => {
        let arrowG = $dataCanvas.select('g.arrow');

        if (!_hitPosition) {
          if (!arrowG.empty()) {
            arrowG.remove();
          }
          return;
        }

        if (arrowG.empty()) {
          arrowG = $dataCanvas.append('g')
            .attr('class', 'arrow');
          arrowG.append('circle')
            .attr('class', 'arrow-display');
          arrowG.append('circle')
            .attr('class', 'arrow-ghost');
        }

        const clamp = clamper(0, _width);

        const arrowInteract = arrowG.select('.arrow-ghost');
        const arrowDisplay = arrowG.select('.arrow-display');

        const datum = {
          ..._arrow,
          hit: _hitPosition
        };

        // We need to store the position of the arrow during the drag event
        // because we need to use it to update the position base on the drag
        // delta. This is needed because we may not be dragging the center
        // of the circle, and we want to avoid a reposition on click.
        /* eslint-disable-next-line prefer-const */
        let arrowPosDirty = {
          // If the hit was skipped, the position won't be available. Set to 0
          // so it's rendered on the top-left.
          cx: cartesianX.invert(_hitPosition.cx) || 0,
          cy: cartesianY.invert(_hitPosition.cy) || 0
        };

        const updateDirtyPos = ({ dx, dy }) => {
          arrowPosDirty.cx = clamp(arrowPosDirty.cx + dx);
          arrowPosDirty.cy = clamp(arrowPosDirty.cy + dy);
          return arrowPosDirty;
        };

        arrowDisplay
          .datum(datum)
          .attr('r', d => rScale(d.thickness / 2))
          // If the hit was skipped, the position won't be available. Set to 0
          // so it's rendered on the top-left.
          .attr('cx', d => cartesianX.invert(d.hit.cx) || 0)
          .attr('cy', d => cartesianY.invert(d.hit.cy) || 0)
          .attr('fill', '#041334');

        arrowInteract
          .datum(datum)
          .attr('r', d => rScale(d.thickness * 4))
          // If the hit was skipped, the position won't be available. Set to 0
          // so it's rendered on the top-left.
          .attr('cx', d => cartesianX.invert(d.hit.cx) || 0)
          .attr('cy', d => cartesianY.invert(d.hit.cy) || 0)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .attr('cursor', 'grab')
          .on('mousedown', function () { d3.select(this).attr('cursor', 'grabbing'); })
          .on('mouseup', function () { d3.select(this).attr('cursor', 'grab'); })
          .call(d3.drag()
            .on('drag', function dragged (d) {
              // Get the new position based on the change rather than the final
              // position.
              const { cx, cy } = updateDirtyPos(d3.event);
              d3.select(this).attr('cx', cx).attr('cy', cy);
              arrowDisplay.attr('cx', cx).attr('cy', cy);
            })
            .on('end', function dragended (d) {
              // Get the new position based on the change rather than the final
              // position.
              const { cx, cy } = updateDirtyPos(d3.event);
              const point = {
                cx: cartesianX(cx),
                cy: cartesianY(cy)
              };
              _onHitChange(point);
            })
          );
      },

      registeredHits: () => {
        let hitsG = $dataCanvas.select('g.hits');
        if (hitsG.empty()) {
          hitsG = $dataCanvas.append('g').attr('class', 'hits');
        }

        const hitCircles = hitsG.selectAll('circle')
          .data(_registeredHits || []);

        hitCircles.exit().remove();

        hitCircles
          .enter()
          .append('circle')
          .merge(hitCircles)
          .attr('r', () => rScale(_arrow.thickness / 2))
          .attr('cx', d => cartesianX.invert(d.cx))
          .attr('cy', d => cartesianY.invert(d.cy))
          .attr('fill', 'red')
          .attr('fill-opacity', 0.64)
          .attr('stroke', '#444');
      }
    };

    updateSize = function () {
      $svg
        .attr('width', _width + margin * 2)
        .attr('height', _width + margin * 2);

      $dataCanvas
        .attr('width', _width)
        .attr('height', _width);

      $dataCanvas.select('.debug')
        .attr('width', _width)
        .attr('height', _width);

      // Update scale ranges.
      rScale.range([0, _width / 2]);
      cartesianX.domain([0, _width]);
      cartesianY.domain([0, _width]);

      // Redraw.
      layers.rings();
      layers.ghostRect();
      layers.interactiveArrow();
      layers.registeredHits();
    };

    updateData = function () {
      if (!_rings || _pauseUpdate) {
        return;
      }

      const maxRing = Math.max(..._rings.map(r => r.radius));

      // Update scale domains.
      rScale.domain([0, maxRing]);
      cartesianX.range([-maxRing, maxRing]);
      cartesianY.range([maxRing, -maxRing]);

      // Redraw.
      layers.rings();
      layers.ghostRect();
      layers.interactiveArrow();
      layers.registeredHits();
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .attr('width', 0)
      .attr('height', 0)
      .style('display', 'block');

    // Datacanvas
    var $dataCanvas = $svg.append('g')
      .attr('class', 'data-canvas')
      .attr('transform', `translate(${margin},${margin})`);

    _calcSize();
    updateSize();
    updateData();
  }

  chartFn.checkSize = function () {
    _calcSize();
    updateSize();
    return chartFn;
  };

  chartFn.destroy = function () {
    // Cleanup.
  };

  chartFn.pauseUpdate = function () {
    _pauseUpdate = true;
    return chartFn;
  };

  chartFn.continueUpdate = function () {
    _pauseUpdate = false;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  // --------------------------------------------
  // Getters and setters.

  chartFn.rings = function (d) {
    if (!arguments.length) return _rings;
    _rings = cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.arrow = function (d) {
    if (!arguments.length) return _arrow;
    _arrow = cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.hitPosition = function (d) {
    if (!arguments.length) return _hitPosition;
    _hitPosition = cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.registeredHits = function (d) {
    if (!arguments.length) return _registeredHits;
    _registeredHits = cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.onHitChange = function (d) {
    if (!arguments.length) return _onHitChange;
    _onHitChange = d;
    return chartFn;
  };

  return chartFn;
};
