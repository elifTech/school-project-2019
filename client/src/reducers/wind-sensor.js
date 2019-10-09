import moment from 'moment';
import {
  WIND_SENSOR_DATA_SUCCESS,
  WIND_SENSOR_DATA_FAILURE,
  WIND_SENSOR_DATA_LOADING,
  WIND_SENSOR_STATUS_LOADING,
  WIND_SENSOR_STATUS_UPDATE,
  FILTER_DATA_LOADING,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  filterLoading: false,
  filterOption: {
    from: moment()
      .local()
      .startOf('day')
      .toJSON(),
    value: 'hour',
  },
  info: { Name: '', Status: 0, Type: '' },
  loading: true,
  statusLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WIND_SENSOR_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
        error: '',
        filterLoading: false,
        loading: false,
      };
    case WIND_SENSOR_DATA_LOADING:
      return { ...state, loading: true };
    case WIND_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, loading: false };
    case WIND_SENSOR_STATUS_UPDATE:
      return {
        ...state,
        info: { ...state.info, Status: action.status },
        statusLoading: false,
      };
    case WIND_SENSOR_STATUS_LOADING:
      return { ...state, statusLoading: true };
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
