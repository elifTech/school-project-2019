import fetch from 'node-fetch';
import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
  WATER_QUALITY_SUCCESS_STATUS,
  WATER_QUALITY_SUCCESS_INFO,
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
  return async dispatch => {
    dispatch(getEventsRequest());
    try {
      const response = await fetch(`http://localhost:8080/water_quality/event`);
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

export function changeStatus(status) {
  console.info(3, status);

  return async dispatch => {
    dispatch(getEventsRequest());
    const body = { Status: status ? 1 : 0 };
    console.log('body', body)
    try {
      const response = await fetch(
        `http://localhost:8080/water_quality/status`,
        {
          body,
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
        },
      );
      //   if (!response.ok) {
      //     throw new Error(`${response.status} ${response.statusText}`);
      //   }
      // const responseStatus = await response.json();
      console.log(53, await response.json())
      return dispatch(changeStatusSuccess(status));
    } catch (error) {
      return dispatch(getEventsFailure(error));
    }
  };
}
