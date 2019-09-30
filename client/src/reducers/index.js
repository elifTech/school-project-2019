import { combineReducers } from 'redux';
import music from './music';
import runtime from './runtime';
import user from './user';
import waterMeter from './water-meter';

export default combineReducers({
  music,
  runtime,
  user,
  waterMeter,
});
