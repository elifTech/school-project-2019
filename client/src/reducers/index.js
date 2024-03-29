import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';

import temperatureSensor from './temperaturesensor';

import user from './user';
import carbonMonoxideSensor from './carbon-monoxide-sensor';
import windSensor from './wind-sensor';
import waterConsumption from './water-consumption';
import waterQuality from './water-quality';

export default combineReducers({
  carbonMonoxideSensor,
  form: formReducer,
  menu,
  temperatureSensor,
  user,
  waterConsumption,
  waterQuality,
  windSensor,
});
