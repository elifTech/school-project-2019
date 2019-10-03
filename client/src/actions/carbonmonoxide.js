import axios from 'axios';
import {
  CARBON_MONOXIDE_SENSOR_DATA_LOADING,
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
} from '../constants';

const carbonSensorSuccess = payload => ({
  payload,
  type: CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
});

const carbonSensorFailure = error => ({
  error,
  type: CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
});

const carbonSensorLoading = () => ({
  type: CARBON_MONOXIDE_SENSOR_DATA_LOADING,
});

// eslint-disable-next-line unicorn/consistent-function-scoping
export default () => async dispatch => {
  dispatch(carbonSensorLoading());
  try {
    const [{ data: info }, { data: events }] = await Promise.all([
      axios.get('http://localhost:8080/carbon'),
      axios.get('http://localhost:8080/sensor/carbon/ping'),
    ]);
    dispatch(carbonSensorSuccess({ events, info }));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};
