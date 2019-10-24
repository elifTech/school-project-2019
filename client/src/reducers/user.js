import { SET_CURRENT_USER, SET_USER_MESSAGE } from '../constants';

const initialState = {
  message: '',
  username: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...action.payload };
    case SET_USER_MESSAGE:
      return { message: action.message };
    default:
      return state;
  }
};
