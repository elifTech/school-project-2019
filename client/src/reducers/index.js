import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import music from './music';
import runtime from './runtime';
import user from './user';

export default combineReducers({
  form: formReducer,
  music,
  runtime,
  user,
});
