import { combineReducers } from 'redux';
import menu from './menu';
import runtime from './runtime';
import waterQuality from './water-quality';

export default combineReducers({
  menu,
  runtime,
  waterQuality,
});
