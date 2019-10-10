/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';
import {
  // CARBON_MONOXIDE_SENSOR_DATA_LOADING,
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
  CARBON_MONOXIDE_SENSOR_STATUS_UPDATE,
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

// const carbonSensorLoading = () => ({
//   type: CARBON_MONOXIDE_SENSOR_DATA_LOADING,
// });

export const changeCarbonStatus = status => async dispatch => {
  try {
    const { data } = await axios.put('http://localhost:8080/sensor/carbon', {
      status: status ? 1 : 0,
    });
    dispatch(updateCarbonStatus(data));
  } catch (error) {
    dispatch(carbonSensorFailure(error.message));
  }
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getCarbonSensorsData = () => async dispatch => {
  // dispatch(carbonSensorLoading());
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
