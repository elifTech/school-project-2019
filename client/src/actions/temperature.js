/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';

import {
  TEMPERATURE_SENSOR_DATA_LOADING,
  TEMPERATURE_SENSOR_DATA_SUCCESS,
  TEMPERATURE_SENSOR_DATA_FAILURE,
  TEMPERATURE_SENSOR_STATUS_UPDATE,
  FILTER_DATA_LOADING,
} from '../constants';

const temperatureSensorSuccess = payload => ({
  payload,
  type: TEMPERATURE_SENSOR_DATA_SUCCESS,
});

const temperatureSensorFailure = error => ({
  error,
  type: TEMPERATURE_SENSOR_DATA_FAILURE,
});

const updateTemperatureStatus = status => ({
  status,
  type: TEMPERATURE_SENSOR_STATUS_UPDATE,
});

const loadFilterData = period => ({
  period,
  type: FILTER_DATA_LOADING,
});

const temperatureSensorLoading = () => ({
  type: TEMPERATURE_SENSOR_DATA_LOADING,
});

export const changeTemperatureStatus = status => async dispatch => {
  try {
    const { data } = await axios.put(
      'http://localhost:8080/sensor/temperature',
      {
        status: status ? 1 : 0,
      },
    );
    dispatch(updateTemperatureStatus(data));
  } catch (error) {
    dispatch(temperatureSensorFailure(error.message));
  }
};

export const getTemperatureSensorData = () => async (dispatch, getState) => {
  dispatch(temperatureSensorLoading());

  const {
    temperatureSensor: {
      filterOption: { from },
    },
  } = getState();

  try {
    const [{ data: info }, { data: events }] = await Promise.all([
      axios.get('http://localhost:8080/temperature'),
      axios.get(
        'http://localhost:8080/temperature/filter/events',
        from && { params: { from } },
      ),
    ]);
    dispatch(temperatureSensorSuccess({ events, info }));
  } catch (error) {
    dispatch(temperatureSensorFailure(error.message));
  }
};

export const setFilter = ({ from, value }) => async dispatch => {
  dispatch(loadFilterData({ from, value }));
  try {
    const { data: events } = await axios.get(
      `http://localhost:8080/temperature/filter/events`,
      {
        params: {
          from,
        },
      },
    );
    dispatch(temperatureSensorSuccess({ events }));
  } catch (error) {
    dispatch(temperatureSensorFailure(error.message));
  }
};
