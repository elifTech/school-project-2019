/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';
import moment from 'moment';
import {
  WIND_SENSOR_DATA_LOADING,
  WIND_SENSOR_DATA_SUCCESS,
  WIND_SENSOR_DATA_FAILURE,
  WIND_SENSOR_STATUS_UPDATE,
  WIND_SENSOR_STATUS_LOADING,
  FILTER_DATA_LOADING,
  apiURL,
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

const updateWindStatus = status => ({
  status,
  type: WIND_SENSOR_STATUS_UPDATE,
});

const loadWindStatus = () => ({
  type: WIND_SENSOR_STATUS_LOADING,
});

const loadFilterData = period => ({
  period,
  type: FILTER_DATA_LOADING,
});

export const applyFilter = ({ from, value }) => async dispatch => {
  dispatch(loadFilterData({ from, value }));
  try {
    const { data: events } = await axios.get(`${apiURL}/wind/events`, {
      params: {
        from,
        to: moment()
          .local()
          .toJSON(),
      },
    });
    dispatch(windSensorSuccess({ events }));
  } catch (error) {
    dispatch(windSensorFailure(error.message));
  }
};

export const changeWindStatus = status => async dispatch => {
  dispatch(loadWindStatus());
  try {
    const { data } = await axios.put(`${apiURL}/wind`, {
      status: status ? 1 : 0,
    });
    const delay = 1000;
    setTimeout(() => dispatch(updateWindStatus(data)), delay);
  } catch (error) {
    dispatch(windSensorFailure(error.message));
  }
};

export const getWindSensorData = () => async (dispatch, getState) => {
  const {
    windSensor: {
      info: { Name: name },
      filterOption: { from },
    },
  } = getState();
  if (!name) dispatch(windSensorLoading());
  const queries = [
    axios.get(`${apiURL}/wind/events`, {
      params: {
        from,
        to: moment()
          .local()
          .toJSON(),
      },
    }),
    !name && axios.get(`${apiURL}/wind`),
  ];

  try {
    const [{ data: events }, { data: info }] = await Promise.all(queries);
    dispatch(windSensorSuccess({ events, ...(info && { info }) }));
  } catch (error) {
    dispatch(windSensorFailure(error.message));
  }
};
