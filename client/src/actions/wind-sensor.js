import axios from 'axios';
import {
  WIND_SENSOR_DATA_LOADING,
  WIND_SENSOR_DATA_SUCCESS,
  WIND_SENSOR_DATA_FAILURE,
} from '../constants';

const windSensorSuccess = payload => ({
  payload,
  type: WIND_SENSOR_DATA_SUCCESS,
});

const windSensorFailure = error => ({
  error,
  type: WIND_SENSOR_DATA_FAILURE,
});

const windSensorLoading = () => ({
  type: WIND_SENSOR_DATA_LOADING,
});

// eslint-disable-next-line unicorn/consistent-function-scoping
export default () => async dispatch => {
  dispatch(windSensorLoading());
  try {
    const [{ data: info }, { data: events }] = await Promise.all([
      axios.get('http://localhost:8080/wind'),
      axios.get('http://localhost:8080/wind/events'),
    ]);
    dispatch(windSensorSuccess({ events, info }));
  } catch (error) {
    dispatch(windSensorFailure(error.message));
  }
};
