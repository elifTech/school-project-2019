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
export default () => async (dispatch, getState) => {
  const { windSensor } = getState();
  if (windSensor.events.length === 0) dispatch(windSensorLoading());
  const queries = [
    axios.get('http://localhost:8080/wind/events'),
    !windSensor.info.Name && axios.get('http://localhost:8080/wind'),
  ];

  try {
    const [{ data: events }, { data: info }] = await Promise.all(queries);
    if (events.length !== windSensor.events.length) {
      dispatch(windSensorSuccess({ events, ...(info && { info }) }));
    }
  } catch (error) {
    dispatch(windSensorFailure(error.message));
  }
};
