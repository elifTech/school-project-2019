import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';
import music from '../actions/music';
import runtime from './runtime';
import carbonSensor from './carbonsensor';

export default combineReducers({
  carbonSensor,
  form: formReducer,
  menu,
  music,
  runtime,
});
