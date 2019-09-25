import React, { Component } from 'react';
import T from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';

import MetaTags from './meta-tags';
import PageHeader from './page-header';

import { appTitle, appDescription } from '../../config';

class App extends Component {
  render () {
    const { pageTitle, className, children } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <div className={c('page', className)}>
        <PageHeader />
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />
        <main className='page__body' role='main'>
          {children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  className: T.string,
  pageTitle: T.string,
  children: T.node
};

function mapStateToProps (state, props) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  dispatcher
)(App);
