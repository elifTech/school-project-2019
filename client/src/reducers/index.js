import { combineReducers } from 'redux';
import menu from './menu';
import runtime from './runtime';

export default combineReducers({
  menu,
  runtime,
});
