import React, { Component } from 'react';
import T from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';

import MetaTags from './meta-tags';
import AppBar from './app-bar';

import { appTitle, appDescription } from '../../config';
import { openDrawer as openDrawerAction } from '../../redux/global';

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
      children,
      backTo,
      onBackClick,
      renderActions
    } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <div className={c('page', className)}>
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />
        <AppBar
          title={pageTitle}
          onMenuClick={this.onMenuClick}
          backTo={backTo}
          onBackClick={onBackClick}
          renderActions={renderActions}
        />
        <main className='page__body' role='main'>
          {children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  openDrawer: T.func,
  className: T.string,
  pageTitle: T.string,
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
