import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import music from './music';
import runtime from './runtime';
import waterQuality from './water-quality';
import user from './user';

export default combineReducers({
  form: formReducer,
  music,
  runtime,
  waterQuality,
  user,
});
