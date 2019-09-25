'use strict';
import { combineReducers } from 'redux';
import sessions from './sessions';

export const reducers = {
  sessions
};

export default combineReducers(reducers);
