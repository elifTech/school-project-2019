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
  WATER_QUALITY_SUCCESS_LOADED,
  apiURL,
} from '../constants';
import apiClient from '../utils/fetch-with-auth';

const NO_CONTENT = 204;

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
const setDataLoaded = isLoaded => {
  return {
    isLoaded,
    type: WATER_QUALITY_SUCCESS_LOADED,
  };
};

export function getEvents() {
  return async (dispatch, getState) => {
    dispatch(getEventsRequest());
    const { waterQuality } = getState();
    const query = queryString.stringify({ period: waterQuality.filter });
    try {
      const { data } = await apiClient.get(
        `${apiURL}/water_quality/event?${query}`,
      );
      dispatch(setDataLoaded(true));
      return dispatch(getEventsSuccess(data));
    } catch (error) {
      return dispatch(getEventsFailure(error.message));
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
      const response = await apiClient.get(`${apiURL}/water_quality/current`);
      if (response.status === NO_CONTENT)
        return dispatch(getCurrentQualitySuccess(0));
      if (!waterQuality.info.Status)
        return dispatch(getCurrentQualitySuccess(0));
      const { data } = response;
      return dispatch(getCurrentQualitySuccess(data.quality));
    } catch (error) {
      return dispatch(getEventsFailure(error.message));
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
    dispatch(setDataLoaded(false));
    dispatch(getEventsRequest());
    try {
      const { data } = await apiClient.get(`${apiURL}/water_quality/ping`);
      const { Name, Status } = data;
      return dispatch(getInfoSuccess({ Name, Status }));
    } catch (error) {
      return dispatch(getEventsFailure(error.message));
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
      const response = await apiClient.get(`${apiURL}/water_quality/structure`);
      if (response.status !== NO_CONTENT) {
        const { Ca, Na, Mg, K } = response.data;
        return dispatch(getWaterStructureSuccess({ Ca, K, Mg, Na }));
      }
      return 0;
    } catch (error) {
      return dispatch(getEventsFailure(error.message));
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
    try {
      const { data } = await apiClient.put(`${apiURL}/water_quality/status`, {
        Status: newStatus ? 1 : 0,
      });
      return dispatch(changeStatusSuccess(data.Status));
    } catch (error) {
      return dispatch(getEventsFailure(error.message));
    }
  };
}
