import { combineReducers } from 'redux';
import menu from './menu';
import runtime from './runtime';
import carbonSensor from './carbonsensor';

export default combineReducers({
  carbonSensor,
  menu,
  runtime,
});
