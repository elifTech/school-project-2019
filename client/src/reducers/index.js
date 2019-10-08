import { combineReducers } from 'redux';
import menu from './menu';
import runtime from './runtime';
import waterMeter from './water-meter';

export default combineReducers({
  menu,
  runtime,
  waterMeter,
});
