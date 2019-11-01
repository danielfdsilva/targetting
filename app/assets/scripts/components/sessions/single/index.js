import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import collecticon from '../../../styles/collecticons';

import App from '../../common/app';
import Analytics from './analytics';
import Results from './results';
import Constrainer from '../../../styles/constrainer';
import TabsNav from '../../common/tabs-nav';
import Dropdown, { DropMenuItem, DropMenu } from '../../common/dropdown';
import { AppBarButton } from '../../common/app-bar';
import FabButton from '../../../styles/button/fab';
import UhOh from '../../uhoh';
import { CleanLink } from '../../../utils/react';

const ActionDelete = styled(DropMenuItem)`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

const ActionExport = styled(DropMenuItem)`
  ::before {
    ${collecticon('chart-pie')}
  }
`;

class SessionSingle extends Component {
  renderAppBarActions () {
    return (
      <Dropdown
        alignment='right'
        direction='down'
        triggerElement={
          <AppBarButton useIcon='ellipsis-vertical' title='View options'>
            Options
          </AppBarButton>
        }
      >
        <DropMenu role='menu' iconified>
          <li>
            <ActionDelete title='Delete session'>Delete</ActionDelete>
          </li>
          <li>
            <ActionExport title='Export data (PDF)'>Export (PDF)</ActionExport>
          </li>
        </DropMenu>
      </Dropdown>
    );
  }

  render () {
    const { match, session } = this.props;

    if (!session) {
      return <UhOh />;
    }

    const tabNavigation = [
      {
        to: match.url,
        label: 'Results',
        exact: true
      },
      {
        to: `${match.url}/analytics`,
        label: 'Analytics',
        exact: true
      }
    ];

    const isComplete = session.hits.length >= session.config.rounds;

    return (
      <App
        pageTitle={session.name}
        backTo='/'
        hasFab={!isComplete}
        renderActions={this.renderAppBarActions}
      >
        <Constrainer>
          {!isComplete && (
            <FabButton
              as={CleanLink}
              to={`/sessions/${match.params.id}/hits/${session.hits.length +
                1}`}
              useIcon='plus--small'
            >
              <span>Score</span>
            </FabButton>
          )}
          <TabsNav items={tabNavigation} />
          <Switch>
            <Route exact path={`${match.path}/analytics`}>
              <Analytics session={session} />
            </Route>
            <Route exact path={`${match.path}`}>
              <Results session={session} />
            </Route>
          </Switch>
        </Constrainer>
      </App>
    );
  }
}

SessionSingle.propTypes = {
  match: T.object,
  session: T.object
};

function mapStateToProps (state, props) {
  const id = props.match.params.id;
  return {
    session: state.sessions.find(s => s.id === id)
  };
}

function dispatcher (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  dispatcher
)(SessionSingle);
