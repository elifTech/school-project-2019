import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';
import runtime from './runtime';
import carbonSensor from './carbonsensor';

export default combineReducers({
  carbonSensor,
  form: formReducer,
  menu,
  runtime,
});
