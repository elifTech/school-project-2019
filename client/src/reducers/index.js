import { combineReducers } from 'redux';
import music from './music';
import runtime from './runtime';
import user from './user';

export default combineReducers({
  music,
  runtime,
  user,
});
