import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import { connect } from 'react-redux';

import MetaTags from './meta-tags';
import AppBar from './app-bar';

import { appTitle, appDescription } from '../../config';
import { openDrawer as openDrawerAction } from '../../redux/global';

const PageBody = styled.main`
  /* Account for the height of the app bar */
  padding-top: 4.5rem;

  ${({ hasFab }) => hasFab &&
    css`
      /* If there's a FAB give it space */
      padding-bottom: 7rem;
    `}
`;

class App extends Component {
  constructor (props) {
    super(props);

    this.onMenuClick = this.onMenuClick.bind(this);
  }

  onMenuClick () {
    this.props.openDrawer();
  }

  render () {
    const {
      pageTitle,
      className,
      hasFab,
      children,
      backTo,
      onBackClick,
      renderActions
    } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <div className={className}>
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />
        <AppBar
          title={pageTitle}
          onMenuClick={this.onMenuClick}
          backTo={backTo}
          onBackClick={onBackClick}
          renderActions={renderActions}
        />
        <PageBody role='main' hasFab={hasFab}>
          {children}
        </PageBody>
      </div>
    );
  }
}

App.propTypes = {
  hasFab: T.bool,
  openDrawer: T.func,
  className: T.string,
  pageTitle: T.string,
  backTo: T.string,
  onBackClick: T.func,
  renderActions: T.func,
  children: T.node
};

function mapStateToProps (state, props) {
  return {};
}

const mapDispatchToProps = {
  openDrawer: openDrawerAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
