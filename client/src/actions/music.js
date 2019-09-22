import fetch from 'node-fetch';
import {
  REQUEST_RECENT_TRACKS,
  FAIL_RECENT_TRACKS,
  GOT_RECENT_TRACKS,
} from '../constants';

export function getRecentTracksRequest() {
  return {
    isFetching: true,
    type: REQUEST_RECENT_TRACKS,
  };
}

export function getRecentTracksSuccess(data) {
  return {
    isFetching: false,
    recentTracks: data,
    type: GOT_RECENT_TRACKS,
  };
}

export function getRecentTracksFailure(error) {
  return { error: String(error), isFetching: false, type: FAIL_RECENT_TRACKS };
}

export function getRecentTracks() {
  return async (dispatch, getState) => {
    dispatch(getRecentTracksRequest());
    const { user: { apiKey, username } = {} } = getState();
    try {
      const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`,
      );
      console.info({ response });
      //   if (!response.ok) {
      //     throw new Error(`${response.status} ${response.statusText}`);
      //   }
      const {
        message: error = null,
        recenttracks: recentTracks,
      } = await response.json();
      if (!recentTracks) {
        throw error;
      }
      return dispatch(getRecentTracksSuccess(recentTracks));
    } catch (error) {
      return dispatch(getRecentTracksFailure(error));
    }
  };
}
