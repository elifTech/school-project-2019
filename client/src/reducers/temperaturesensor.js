import moment from 'moment';
import {
  TEMPERATURE_SENSOR_DATA_SUCCESS,
  TEMPERATURE_SENSOR_DATA_FAILURE,
  TEMPERATURE_SENSOR_DATA_LOADING,
  TEMPERATURE_SENSOR_STATUS_UPDATE,
  FILTER_DATA_LOADING,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  filterLoading: false,
  filterOption: {
    from: moment().subtract('days', 1),
  },
  info: { Name: '', Type: '', status: 1 },
  isLoading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TEMPERATURE_SENSOR_DATA_SUCCESS:
      return { ...state, ...action.payload, error: '', isLoading: false };
    case TEMPERATURE_SENSOR_STATUS_UPDATE:
      return {
        ...state,
        info: { ...state.info, Status: action.status },
        statusLoading: false,
      };
    case TEMPERATURE_SENSOR_DATA_LOADING:
      return { ...state, loading: true };
    case TEMPERATURE_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, loading: false };
    case FILTER_DATA_LOADING:
      return {
        ...state,
        filterLoading: true,
        filterOption: { from: action.period.from, value: action.period.value },
      };
    default:
      return state;
  }
};
