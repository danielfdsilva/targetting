'use strict';
import '@babel/polyfill';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import theme from './styles/theme/theme';

import store from './utils/store';
import history from './utils/history';

import GlobalStyles from './styles/global';

// Views
import About from './components/about';
import Home from './components/home';
import UhOh from './components/uhoh';
import SessionForm from './components/sessions/form';
import SessionSingle from './components/sessions/single';
import ErrorBoundary from './fatal-error-boundary';
import DrawerMenu from './components/common/drawer-menu';

// Root component. Used by the router.
const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <ThemeProvider theme={theme.main}>
        <ErrorBoundary>
          <GlobalStyles />
          <DrawerMenu />
          <Switch>
            <Route exact path='/about' component={About} />
            <Route exact path='/' component={Home} />
            <Route exact path='/sessions' component={Home} />
            <Route exact path='/sessions/new' component={SessionForm} />
            <Route exact path='/sessions/:id' component={SessionSingle} />
            <Route path='*' component={UhOh} />
          </Switch>
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  </Provider>
);

render(<Root store={store} />, document.querySelector('#app-container'));
