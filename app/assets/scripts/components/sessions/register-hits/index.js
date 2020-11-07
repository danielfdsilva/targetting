import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import get from 'lodash.get';
import { tint } from 'polished';

import { registerHit } from '../../../redux/sessions';
import { getTarget } from '../../../utils/targets';
import { getArrow } from '../../../utils/arrows';
import { themeVal, stylizeFunction } from '../../../styles/utils/general';
import collecticon from '../../../styles/collecticons';
import { multiply } from '../../../styles/utils/math';

import App from '../../common/app';
import Constrainer from '../../../styles/constrainer';
import Target from '../../common/target';
import { AppBarButton } from '../../common/app-bar';
import UhOh from '../../uhoh';
import Heading from '../../../styles/type/heading';
import { collision } from '../../../utils/utils';

const _tint = stylizeFunction(tint);
const glsp = themeVal('layout.space');

const ArrowDetails = styled.header`
  display: flex;
  align-items: center;
  margin: -${glsp} -${glsp} ${multiply(glsp, 2)} -${glsp};
  padding: ${glsp};
  box-shadow: 0 1px 0 0 ${themeVal('color.alpha')};
`;

const ArrowMeta = styled.div`
  p {
    margin-left: 1.5rem;
    font-size: 0.875rem;
    color: ${_tint(0.32, themeVal('type.base.color'))};
  }
`;

const ArrowId = styled(Heading)`
  &::before {
    ${collecticon('compass-2')}
    vertical-align: top;
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const ArrowScore = styled.div`
  margin-left: auto;
  font-size: 2rem;
`;

class RegisterHits extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentArrow: 1,
      hits: props.roundHits
    };

    this.onHitChange = this.onHitChange.bind(this);
    this.onSubmitScore = this.onSubmitScore.bind(this);
  }

  getTargetDef () {
    return getTarget(this.props.target);
  }

  getArrowDef () {
    return getArrow(this.props.arrows.type);
  }

  onArrowChange (change) {
    this.setState(({ currentArrow }) => ({
      currentArrow: currentArrow + change
    }));
  }

  onHitChange (pos) {
    const targetDef = this.getTargetDef();
    const arrowDef = this.getArrowDef();

    const rings = targetDef.rings;
    // Create a circle definition for the arrow.
    const posCircle = {
      cx: pos.cx,
      cy: pos.cy,
      r: arrowDef.thickness / 2
    };

    // Find the first target ring that collides with our arrow.
    const ringIndex = rings.findIndex(({ radius: r }) =>
      collision({ cx: 0, cy: 0, r }, posCircle)
    );

    this.setState(({ hits, currentArrow }) => ({
      hits: Object.assign([], hits, {
        [currentArrow - 1]: {
          ...pos,
          value: get(targetDef.rings, [ringIndex, 'points'], 0)
        }
      })
    }));
  }

  onSubmitScore () {
    const { hits } = this.state;
    const {
      match: { params },
      arrows,
      registerHit,
      history
    } = this.props;

    // Register all the hits.
    arrows.ids.forEach((id, arrowIdx) => {
      registerHit(params.id, params.round - 1, arrowIdx, hits[arrowIdx] || {
        value: 0
      });
    });

    history.push(`/sessions/${params.id}`);
  }

  renderAppBarActions () {
    const { currentArrow } = this.state;
    const arrowCount = this.props.arrows.ids.length;

    return (
      <React.Fragment>
        <AppBarButton
          disabled={currentArrow === 1}
          useIcon='arrow-left'
          onClick={this.onArrowChange.bind(this, -1)}
        >
          Previous Arrow
        </AppBarButton>
        {currentArrow < arrowCount ? (
          <AppBarButton
            useIcon='arrow-right'
            onClick={this.onArrowChange.bind(this, 1)}
          >
            Next Arrow
          </AppBarButton>
        ) : (
          <AppBarButton useIcon='tick' onClick={this.onSubmitScore}>
            Confirm scoring
          </AppBarButton>
        )}
      </React.Fragment>
    );
  }

  render () {
    const {
      match: { params: { round, id } },
      name,
      rounds, arrows
    } = this.props;
    const { currentArrow, hits } = this.state;

    if (!name) return <UhOh />;

    const currRound = Number(round);
    const arrowId = arrows.ids[currentArrow - 1];

    if (
      isNaN(currRound) ||
      !Number.isFinite(currRound) ||
      currRound < 1 ||
      currRound > rounds
    ) {
      return <UhOh />;
    }

    return (
      <App
        pageTitle='Register hit'
        backTo={`/sessions/${id}`}
        // This has to be a function for the render to be triggered.
        // If not react won't notice a change a won't render the component,
        // as it should!
        renderActions={this.renderAppBarActions.bind(this)}
      >
        <Constrainer>
          <ArrowDetails>
            <ArrowMeta>
              <ArrowId size='large'>{arrowId}</ArrowId>
              <p>
                Arrow {currentArrow} of {arrows.ids.length}
              </p>
            </ArrowMeta>
            <ArrowScore>{get(hits, [currentArrow - 1, 'value'], 0)}</ArrowScore>
          </ArrowDetails>

          <Target
            rings={this.getTargetDef().rings}
            arrow={this.getArrowDef()}
            hitPosition={hits[currentArrow - 1]}
            onHitChange={this.onHitChange}
          />
        </Constrainer>
      </App>
    );
  }
}

RegisterHits.propTypes = {
  match: T.object,
  history: T.object,
  registerHit: T.func,
  name: T.string,
  rounds: T.number,
  target: T.string,
  arrows: T.object,
  roundHits: T.array
};

function mapStateToProps (state, props) {
  const id = props.match.params.id;
  const round = props.match.params.round - 1;
  const session = state.sessions.find(s => s.id === id);
  return {
    name: get(session, 'name'),
    rounds: get(session, 'config.rounds'),
    target: get(session, 'config.target'),
    arrows: get(session, 'config.arrows'),
    roundHits: get(session, ['hits', round], [])
  };
}

function dispatcher (dispatch) {
  return {
    registerHit: (...args) => dispatch(registerHit(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(RegisterHits);
