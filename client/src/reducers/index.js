import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';
import runtime from './runtime';
import temperatureSensor from './temperaturesensor';
import waterQuality from './water-quality';

export default combineReducers({
  form: formReducer,
  menu,
  runtime,
  temperatureSensor,
  waterQuality,
});
