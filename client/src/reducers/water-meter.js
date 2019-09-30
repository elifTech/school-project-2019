import {
  REQUEST_WATERMETER_EVENTS,
  FAIL_WATERMETER_EVENTS,
  GOT_WATERMETER_EVENTS,
} from '../constants';

const initialState = {
  error: '',
  isFetching: true,
  waterMeterEvents: [],
};

export default function waterMeter(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_WATERMETER_EVENTS:
      return {
        ...state,
        isFetching: true,
      };
    case GOT_WATERMETER_EVENTS:
      return {
        ...action.payload,
        error: null,
        isFetching: false,
      };

    case FAIL_WATERMETER_EVENTS:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}
