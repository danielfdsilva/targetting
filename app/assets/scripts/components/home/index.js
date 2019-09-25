import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import collecticon from '../../styles/collecticons';

import App from '../common/app';
import Table from '../../styles/table';
import Constrainer from '../../styles/constrainer';
import Button from '../../styles/button/button';
import Heading from '../../styles/type/heading';
import { themeVal } from '../../styles/utils/general';

const AddSessionBtn = styled(Button)`
  &::before {
    ${collecticon('plus--small')}
  }
`;

const EmptyBlock = styled.div`
  border-radius: ${themeVal('shape.rounded')};
  border: 2px dashed ${themeVal('color.alpha')};
  text-align: center;
  padding: 4rem 2rem;
  color: ${themeVal('color.shadow')};
`;

class Home extends Component {
  renderSessionsTable () {
    return (
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Date</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {this.props.sessions.map(session => (
            <tr key={session.id}>
              <td><Link to={`/sessions/${session.id}`}>{session.name}</Link></td>
              <td>{session.date}</td>
              <td>--<small>300</small></td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render () {
    return (
      <App>
        <Constrainer>
          <Heading>Sessions</Heading>
          <AddSessionBtn
            as={Link}
            to='/sessions/new'
            variation='primary-raised-dark'
          >
            Session
          </AddSessionBtn>

          {
            this.props.sessions.length
              ? this.renderSessionsTable()
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
