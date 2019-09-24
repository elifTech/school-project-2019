import { SET_CURRENT_TAB } from '../constants';

const initialState = {
  currentTab: '',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_TAB:
      return { currentTab: action.payload };
    default:
      return state;
  }
};
