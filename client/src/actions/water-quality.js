import fetch from 'node-fetch';
import { REQUEST_EVENTS, SUCCESS_EVENTS, FAIL_EVENTS } from '../constants';

export function getEventsRequest() {
  return {
    isFetching: true,
    type: REQUEST_EVENTS,
  };
}

export function getEventsSuccess(data) {
  return {
    events: data,
    isFetching: false,
    type: SUCCESS_EVENTS,
  };
}

export function getEventsFailure(error) {
  return { error: String(error), isFetching: false, type: FAIL_EVENTS };
}

export function getEvents() {
  return async dispatch => {
    dispatch(getEventsRequest());
    try {
      const response = await fetch(`http://localhost:8080/water_quality/event`);
      console.info(1, response);
      //   if (!response.ok) {
      //     throw new Error(`${response.status} ${response.statusText}`);
      //   }
      const events = await response.json();
      console.info(2, events);
      return dispatch(getEventsSuccess(events));
    } catch (error) {
      return dispatch(getEventsFailure(error));
    }
  };
}
