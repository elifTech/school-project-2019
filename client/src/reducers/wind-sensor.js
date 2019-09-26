import {
  WIND_SENSOR_DATA_SUCCESS,
  WIND_SENSOR_DATA_FAILURE,
  WIND_SENSOR_DATA_LOADING,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  info: { Name: '', Status: 0, Type: '' },
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WIND_SENSOR_DATA_SUCCESS:
      return { ...state, ...action.payload, error: '', loading: false };
    case WIND_SENSOR_DATA_LOADING:
      return { ...state, loading: true };
    case WIND_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};
