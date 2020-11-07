'use strict';
import { combineReducers } from 'redux';
import sessions from './sessions';
import global from './global';

export const reducers = {
  sessions,
  global
};

export default combineReducers(reducers);
