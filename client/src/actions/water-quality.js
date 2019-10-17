import fetch from 'node-fetch';
import queryString from 'query-string';
import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
  WATER_QUALITY_SUCCESS_STATUS,
  WATER_QUALITY_SUCCESS_INFO,
  WATER_QUALITY_FILTER,
} from '../constants';

const getEventsRequest = () => {
  return {
    isFetching: true,
    type: WATER_QUALITY_REQUEST_EVENTS,
  };
};

const getEventsSuccess = data => {
  return {
    events: data,
    isFetching: false,
    type: WATER_QUALITY_SUCCESS_EVENTS,
  };
};

const getEventsFailure = error => {
  return {
    error: String(error),
    isFetching: false,
    type: WATER_QUALITY_FAIL_EVENTS,
  };
};

export function getEvents() {
  return async (dispatch, getState) => {
    dispatch(getEventsRequest());
    const { waterQuality } = getState();
    const query = queryString.stringify({ period: waterQuality.filter });
    try {
      // const response = await fetch(
      //   `http://localhost:8080/water_quality/events`,
      // );
      const response = await fetch(
        `http://localhost:8080/water_quality/event?${query}`,
      );
      const events = await response.json();
      return dispatch(getEventsSuccess(events));
    } catch (error) {
      return dispatch(getEventsFailure(error));
    }
  };
}

const getInfoSuccess = info => {
  return {
    info,
    isFetching: false,
    type: WATER_QUALITY_SUCCESS_INFO,
  };
};

export function getInfo() {
  return async dispatch => {
    dispatch(getEventsRequest());
    try {
      const response = await fetch(`http://localhost:8080/water_quality/ping`);
      const { Name, Status } = await response.json();
      return dispatch(getInfoSuccess({ Name, Status }));
    } catch (error) {
      return dispatch(getEventsFailure(error));
    }
  };
}

const changeStatusSuccess = status => {
  return {
    isFetching: false,
    status,
    type: WATER_QUALITY_SUCCESS_STATUS,
  };
};

export function changeFilter(filter) {
  return dispatch => () => {
    dispatch({
      filter,
      type: WATER_QUALITY_FILTER,
    });
  };
}

export function changeStatus(newStatus) {
  return async dispatch => {
    dispatch(getEventsRequest());
    const body = { Status: newStatus ? 1 : 0 };
    try {
      const response = await fetch(
        `http://localhost:8080/water_quality/status`,
        {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        },
      );
      const { Status } = await response.json();
      return dispatch(changeStatusSuccess(Status));
    } catch (error) {
      return dispatch(getEventsFailure(error));
    }
  };
}
