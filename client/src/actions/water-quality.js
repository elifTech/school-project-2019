import fetch from 'node-fetch';
import queryString from 'query-string';
import {
  WATER_QUALITY_REQUEST_EVENTS,
  WATER_QUALITY_SUCCESS_EVENTS,
  WATER_QUALITY_FAIL_EVENTS,
  WATER_QUALITY_SUCCESS_STATUS,
  WATER_QUALITY_SUCCESS_INFO,
  WATER_QUALITY_FILTER,
  WATER_QUALITY_SUCCESS_STRUCTURE,
  WATER_QUALITY_SUCCESS_CURRENT,
} from '../constants';

const getEventsRequest = () => {
  return {
    isFetching: true,
    type: WATER_QUALITY_REQUEST_EVENTS,
  };
};

const getEventsSuccess = events => {
  return {
    events,
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

const getCurrentQualitySuccess = currentQuality => {
  return {
    currentQuality,
    isFetching: false,
    type: WATER_QUALITY_SUCCESS_CURRENT,
  };
};

export function getCurrentEvent() {
  return async (dispatch, getState) => {
    const { waterQuality } = getState();
    dispatch(getEventsRequest());
    try {
      const currentResponse = await fetch(
        `http://localhost:8080/water_quality/current`,
      );
      const { quality } = await currentResponse.json();
      if (!waterQuality.info.Status)
        return dispatch(getCurrentQualitySuccess(0));
      return dispatch(getCurrentQualitySuccess(quality));
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

const getWaterStructureSuccess = waterStructure => {
  return {
    isFetching: false,
    type: WATER_QUALITY_SUCCESS_STRUCTURE,
    waterStructure,
  };
};

export function getWaterStructure() {
  return async dispatch => {
    dispatch(getEventsRequest());
    try {
      const response = await fetch(
        `http://localhost:8080/water_quality/structure`,
      );
      const { Ca, Na, Mg, K } = await response.json();
      return dispatch(getWaterStructureSuccess({ Ca, K, Mg, Na }));
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
