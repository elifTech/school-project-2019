import { REQUEST_EVENTS, SUCCESS_EVENTS, FAIL_EVENTS } from '../constants';

export default function music(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
      };
    case SUCCESS_EVENTS:
      return {
        ...state,
        error: null,
        events: action.events,
        isFetching: false,
      };

    case FAIL_EVENTS:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}
