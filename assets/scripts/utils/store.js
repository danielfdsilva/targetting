'use strict';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { environment } from '../config';
import reducer from '../redux';

const lsKey = 'targetting.data';
// Try to get state from localstorage.
const lsData = localStorage.getItem(lsKey);

const initialState = lsData ? JSON.parse(lsData) : {};

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => environment !== 'production'
});

const composeEnhancers =
  environment !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunkMiddleware, logger))
);

store.subscribe(() => localStorage.setItem(lsKey, JSON.stringify(store.getState())));

export default store;
