import { SET_USER_DATA } from '../constants';

export default function user(state = {}, action = {}) {
  let newState;
  switch (action.type) {
    case SET_USER_DATA:
      newState = {
        ...state,
      };
      if (action.username !== undefined) {
        newState.username = action.username;
      }
      if (action.apiKey !== undefined) {
        newState.apiKey = action.apiKey;
      }
      return newState;
    default:
      return state;
  }
}
