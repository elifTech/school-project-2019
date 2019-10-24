import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';

import temperatureSensor from './temperaturesensor';

import windSensor from './wind-sensor';
import waterMeter from './water-meter';

import waterQuality from './water-quality';

export default combineReducers({
  form: formReducer,
  menu,
  temperatureSensor,
  waterMeter,
  waterQuality,
  windSensor,
});
