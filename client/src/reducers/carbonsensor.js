import moment from 'moment';
import {
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
  CARBON_MONOXIDE_SENSOR_DATA_LOADING,
  CARBON_MONOXIDE_SENSOR_STATUS_UPDATE,
  FILTER_DATA_LOADING,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  filterLoading: false,
  filterOption: {
    from: moment().subtract(1, 'hours'),
  },
  info: { Name: '', Type: '', status: 1 },
  isLoading: true,
  isVisible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CARBON_MONOXIDE_SENSOR_DATA_SUCCESS:
      return { ...state, ...action.payload, error: '', isLoading: false };
    case CARBON_MONOXIDE_SENSOR_STATUS_UPDATE:
      return {
        ...state,
        info: { ...state.info, Status: action.Status },
        isLoading: false,
      };
    case CARBON_MONOXIDE_SENSOR_DATA_LOADING:
      return { ...state };
    case CARBON_MONOXIDE_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, isLoading: false };
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
