import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';
import runtime from './runtime';
import waterMeter from './water-meter';

export default combineReducers({
  form: formReducer,
  menu,
  runtime,
  waterMeter,
});
