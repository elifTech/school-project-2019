import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  info: { Name: '', Status: 0, Type: '' },
  isFetching: true,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case WATER_QUALITY_REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
      };
    case WATER_QUALITY_SUCCESS_EVENTS:
      return {
        ...state,
        error: null,
        events: action.events,
        isFetching: false,
      };

    case WATER_QUALITY_FAIL_EVENTS:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
