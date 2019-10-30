/* eslint-disable unicorn/consistent-function-scoping */
import apiClient from '../utils/fetch-with-auth';
import {
  CARBON_MONOXIDE_SENSOR_DATA_LOADING,
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
  CARBON_MONOXIDE_SENSOR_STATUS_UPDATE,
  FILTER_DATA_LOADING,
  apiURL,
} from '../constants';

const carbonSensorSuccess = payload => ({
  payload,
  type: CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
});

const carbonSensorFailure = error => ({
  error,
  type: CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
});

const updateCarbonStatus = status => ({
  status,
  type: CARBON_MONOXIDE_SENSOR_STATUS_UPDATE,
});

const loadFilterData = period => ({
  period,
  type: FILTER_DATA_LOADING,
});
const carbonSensorLoading = () => ({
  type: CARBON_MONOXIDE_SENSOR_DATA_LOADING,
});

export const changeCarbonStatus = status => async dispatch => {
  try {
    const { data } = await apiClient.put(`${apiURL}/carbon`, {
      Status: status ? 1 : 0,
    });
    dispatch(updateCarbonStatus(data));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};

export const getCarbonSensorsData = () => async (dispatch, getState) => {
  dispatch(carbonSensorLoading());
  const {
    carbonMonoxideSensor: {
      filterOption: { from },
    },
  } = getState();
  try {
    const [{ data: info }, { data: events }] = await Promise.all([
      apiClient.get(`${apiURL}/carbon`),
      apiClient.get(`${apiURL}/carbon/filter/events`, from && { from }),
    ]);
    dispatch(carbonSensorSuccess({ events, info }));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};

export const setBoundaries = ({ from, value }) => async dispatch => {
  dispatch(loadFilterData({ from, value }));
  try {
    const { data: events } = await apiClient.get(
      `http://localhost:8080/carbon/filter/events`,
      {
        from,
      },
    );
    dispatch(carbonSensorSuccess({ events }));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};

export const getWidgetsData = () => async dispatch => {
  try {
    const [{ data: info }, { data: events }] = await Promise.all([
      apiClient.get('http://localhost:8080/carbon'),
      apiClient.get('http://localhost:8080/carbon/ping'),
    ]);
    dispatch(carbonSensorSuccess({ events, info }));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};
