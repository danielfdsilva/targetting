import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { themeVal } from '../../styles/utils/general';
import { getTarget } from '../../utils/targets';
import { getSessionScore } from '../../utils/utils';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import Session from './session';
import { CleanLink } from '../../utils/react';
import FabButton from '../../styles/button/fab';

const EmptyBlock = styled.div`
  border-radius: ${themeVal('shape.rounded')};
  border: 2px dashed ${themeVal('color.alpha')};
  text-align: center;
  padding: 4rem 2rem;
  color: ${themeVal('color.shadow')};
`;

const SessionList = styled.ul`
  margin: -${themeVal('layout.space')};

  li {
    box-shadow: 0 1px 0 0 ${themeVal('color.alpha')};
  }
`;

class Home extends Component {
  renderSessionsList () {
    return (
      <SessionList>
        {this.props.sessions.map(session => {
          const sessionScore = getSessionScore(session);
          return (
            <li key={session.id}>
              <Session
                id={session.id}
                name={session.name}
                date={session.date}
                distance={session.distance}
                target={getTarget(session.config.target).name}
                score={sessionScore.score}
                maxPoints={sessionScore.max}
              />
            </li>
          );
        })}
      </SessionList>
    );
  }

  render () {
    return (
      <App pageTitle='Sessions' hasFab>
        <Constrainer>
          <FabButton as={CleanLink} useIcon='plus--small' to='/sessions/new'>
            <span>Session</span>
          </FabButton>

          {this.props.sessions.length ? (
            this.renderSessionsList()
          ) : (
            <EmptyBlock>
              <p>There are no sessions.</p>
              <p>Start by adding one.</p>
            </EmptyBlock>
          )}
        </Constrainer>
      </App>
    );
  }
}

Home.propTypes = {
  sessions: T.array
};

function mapStateToProps (state, props) {
  return {
    sessions: state.sessions
  };
}

function dispatcher (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
