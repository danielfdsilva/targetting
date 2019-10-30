import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { themeVal } from '../../styles/utils/general';
import { getTarget } from '../../utils/targets';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import Button from '../../styles/button/button';
import Session from './session';

const AddSessionBtn = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  border-radius: ${themeVal('shape.ellipsoid')};
`;

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
        {this.props.sessions.map(session => (
          <li key={session.id}>
            <Session
              id={session.id}
              name={session.name}
              date={session.date}
              distance={session.distance}
              target={getTarget(session.config.target).name}
              score={271}
              maxPoints={300}
            />
          </li>
        ))}
      </SessionList>
    );
  }

  render () {
    return (
      <App pageTitle='Sessions' hasFab>
        <Constrainer>
          <AddSessionBtn
            as={Link}
            useIcon='plus--small'
            hideText
            to='/sessions/new'
            variation='primary-raised-dark'
            size='xlarge'
          >
            <span>Session</span>
          </AddSessionBtn>

          {
            this.props.sessions.length
              ? this.renderSessionsList()
              : (
                <EmptyBlock>
                  <p>There are no sessions.</p>
                  <p>Start by adding one.</p>
                </EmptyBlock>
              )
          }
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
  return {
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
