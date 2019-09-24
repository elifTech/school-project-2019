import { combineReducers } from 'redux';
import menu from './menu';
import runtime from './runtime';
import windSensor from './wind-sensor';

export default combineReducers({
  menu,
  runtime,
  windSensor,
});
