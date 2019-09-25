import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import get from 'lodash.get';

import App from '../../common/app';
import { arrayRange, arraySort } from '../../../utils/array';
import Table from '../../../styles/table';
import Constrainer from '../../../styles/constrainer';
import Target from '../../common/target';
import { registerHit } from '../../../redux/sessions';
import Button from '../../../styles/button/button';
import collecticon from '../../../styles/collecticons';
import { getTarget } from '../../../utils/targets';
import { getArrow } from '../../../utils/arrows';

const ScoreButton = styled(Button)`
  &::before {
    ${collecticon('target')}
  }
`;

const NextArrowBtn = styled(Button)`
  &::before {
    ${collecticon('target')}
  }
`;

const TargetHeatmap = styled.div`
  max-width: 12rem;
  margin: 2rem auto 0 auto;

  h3 {
    text-align: center;
  }
`;

function collision (circle1, circle2) {
  const { cx: cx1, cy: cy1, r: r1 } = circle1;
  const { cx: cx2, cy: cy2, r: r2 } = circle2;

  const distance = r1 + r2;
  const x = cx1 - cx2;
  const y = cy1 - cy2;

  return distance >= Math.sqrt((x * x) + (y * y));
}

class SessionSingle extends Component {
  constructor (props) {
    super(props);

    this.state = {
      registering: {
        round: null,
        arrow: null
      }
    };

    this.onRegisterClick = this.onRegisterClick.bind(this);
    this.onHitChange = this.onHitChange.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
  }

  getTargetDef () {
    return getTarget(this.props.session.config.target);
  }

  getArrowDef () {
    return getArrow(this.props.session.config.arrows.type);
  }

  onRegisterClick () {
    const roundToInsert = this.props.session.hits.length;
    this.setState({
      registering: {
        round: roundToInsert,
        arrow: 0,
        hitPosition: null
      }
    });
  }

  onHitChange (pos) {
    const targetDef = this.getTargetDef();
    const arrowDef = this.getArrowDef();

    const rings = targetDef.rings;
    const posCircle = {
      cx: pos.cx,
      cy: pos.cy,
      r: arrowDef.thickness / 2
    };
    const ringIndex = rings.findIndex(({ radius: r }) => collision({ cx: 0, cy: 0, r }, posCircle));

    this.setState(state => ({
      registering: {
        ...state.registering,
        hitPosition: pos,
        hitValue: get(targetDef.rings, [ringIndex, 'points'], 0)
      }
    }));
  }

  onNextClick () {
    const {
      round: registerRound,
      arrow: registerArrow,
      hitPosition,
      hitValue
    } = this.state.registering;
    const {
      match: { params },
      session: { config: { arrows } },
      registerHit
    } = this.props;

    registerHit(params.id, registerRound, registerArrow, {
      ...hitPosition,
      value: hitValue
    });

    if (registerArrow + 1 >= arrows.ids.length) {
      this.setState({
        registering: {
          round: null,
          arrow: null,
          hitPosition: null
        }
      });
    } else {
      this.setState(state => ({
        registering: {
          ...state.registering,
          arrow: registerArrow + 1,
          hitPosition: null
        }
      }));
    }
  }

  renderHitRegister () {
    const targetDef = this.getTargetDef();
    const arrowDef = this.getArrowDef();
    const { arrow: registerArrow, hitPosition } = this.state.registering;
    const { config: { arrows } } = this.props.session;
    const arrowsPerRound = arrows.ids.length;

    return (
      <div>
        <h2>{arrows.ids[registerArrow]}</h2>
        <Target
          rings={targetDef.rings}
          arrow={arrowDef}
          hitPosition={hitPosition}
          onHitChange={this.onHitChange}
        />
        <NextArrowBtn
          onClick={this.onNextClick}
        >
          {registerArrow < arrowsPerRound - 1 ? 'Next' : 'Finish'}
        </NextArrowBtn>
      </div>
    );
  }

  renderScoreTable () {
    const { config: { arrows, rounds }, hits } = this.props.session;
    const targetDef = this.getTargetDef();
    const arrowDef = this.getArrowDef();

    return (
      <React.Fragment>
        <ScoreButton
          onClick={this.onRegisterClick}
          variation='primary-raised-dark'
        >
          Score
        </ScoreButton>
        <Table>
          <thead>
            <tr>
              <th>Rounds</th>
              {arrayRange(1, arrows.ids.length).map(a => (<th key={a}>{a}</th>))}
              <th>Sub</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {arrayRange(1, rounds).map((s, sIdx) => {
              const roundHits = get(hits, [sIdx], []);
              const sortedRoundHits = arraySort(roundHits, 'value');

              const hitsUntilRound = hits.slice(0, s);
              const total = hitsUntilRound.length === s
                ? hitsUntilRound.reduce((tot, ht) => {
                  // Safe check
                  if (tot === null) return null;
                  if (ht.length !== arrows.ids.length) return null;
                  return tot + ht.reduce((sum, v) => sum + v.value, 0);
                }, 0)
                : null;

              return (
                <tr key={s}>
                  <th>{s}</th>
                  {arrayRange(1, arrows.ids.length).map((a, aIdx) => (<td key={`${s}-${a}`}>{get(sortedRoundHits, [aIdx, 'value'], '')}</td>))}
                  <td>
                    {roundHits.length === arrows.ids.length
                      ? roundHits.reduce((sum, v) => sum + v.value, 0)
                      : null}
                  </td>
                  <td>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {arrows.ids.map((a, aIdx) => (
          <TargetHeatmap key={a}>
            <h3>Arrow: {a}</h3>
            <Target
              rings={targetDef.rings}
              arrow={arrowDef}
              hits={hits.map(round => round[aIdx])}
            />
          </TargetHeatmap>
        ))}
      </React.Fragment>
    );
  }

  render () {
    console.log('this.props', this.props);
    const { round: registerRound, arrow: registerArrow } = this.state.registering;
    return (
      <App>
        <Constrainer>
          {
            registerRound !== null && registerArrow !== null
              ? this.renderHitRegister()
              : this.renderScoreTable()
          }
        </Constrainer>
      </App>
    );
  }
}

SessionSingle.propTypes = {
  registerHit: T.func,
  match: T.object,
  session: T.object
};

function mapStateToProps (state, props) {
  const id = props.match.params.id;
  return {
    registerHit: T.func,
    session: state.sessions.find(s => s.id === id)
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
)(SessionSingle);
