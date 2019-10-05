import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
  WATER_QUALITY_SUCCESS_STATUS,
  WATER_QUALITY_SUCCESS_INFO,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  info: { Name: '', Status: 0 },
  isFetching: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case WATER_QUALITY_REQUEST_EVENTS:
      return {
        ...state,
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_SUCCESS_EVENTS:
      return {
        ...state,
        error: null,
        events: action.events,
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_SUCCESS_STATUS:
      return {
        ...state,
        info: { ...state.info, Status: action.status },
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_SUCCESS_INFO:
      return {
        ...state,
        info: action.info,
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_FAIL_EVENTS:
      return {
        ...state,
        error: action.error,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
};
