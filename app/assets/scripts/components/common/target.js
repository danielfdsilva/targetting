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
          .attr('stroke-width', d => d.separator ? '2px' : '1x');
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
          .attr('width', _width)
          .attr('height', _width);
      },

      interactiveArrow: () => {
        let arrow = $dataCanvas.select('circle.arrow');

        if (!_hitPosition) {
          if (!arrow.empty()) {
            arrow.remove();
          }
          return;
        }

        if (arrow.empty()) {
          arrow = $dataCanvas.append('circle')
            .attr('class', 'arrow');
        }

        const clamp = clamper(0, _width);

        arrow
          .datum(_arrow)
          .attr('r', d => rScale(d.thickness / 2))
          .attr('cx', cartesianX.invert(_hitPosition.cx))
          .attr('cy', cartesianY.invert(_hitPosition.cy))
          .attr('fill', '#041334')
          .call(d3.drag()
            .on('drag', function dragged (d) {
              d3.select(this)
                .attr('cx', clamp(d3.event.x))
                .attr('cy', clamp(d3.event.y));
            })
            .on('end', function dragended (d) {
              const { x: xPos, y: yPos } = d3.event;
              const point = {
                cx: cartesianX(xPos),
                cy: cartesianY(yPos)
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

    // $dataCanvas.append('rect')
    //   .attr('class', 'debug')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('fill', 'blue')
    //   .attr('opacity', 0.2);

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
