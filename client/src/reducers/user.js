import { SET_USER_MESSAGE } from '../constants';

const initialState = {
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_MESSAGE:
      return { message: action.message };
    default:
      return state;
  }
};
