import {
  GOT_RECENT_TRACKS,
  FAIL_RECENT_TRACKS,
  REQUEST_RECENT_TRACKS,
} from '../constants';

export default function music(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_RECENT_TRACKS:
      return {
        ...state,
        isFetching: true,
      };
    case GOT_RECENT_TRACKS:
      return {
        ...state,
        error: null,
        isFetching: false,
        recentTracks: action.recentTracks,
      };

    case FAIL_RECENT_TRACKS:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}
