import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
  WATER_QUALITY_SUCCESS_STATUS,
  WATER_QUALITY_SUCCESS_INFO,
  WATER_QUALITY_FILTER,
} from '../constants';

const initialState = {
  critics: { max: 0, min: 0 },
  currentQuality: 0,
  error: '',
  events: [],
  filter: 'hour',
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
        currentQuality: action.currentQuality,
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
        critics: action.critics,
        info: action.info,
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_FAIL_EVENTS:
      return {
        ...state,
        error: action.error,
        isFetching: action.isFetching,
      };
    case WATER_QUALITY_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    default:
      return state;
  }
};
