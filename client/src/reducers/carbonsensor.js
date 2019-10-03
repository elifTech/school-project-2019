import {
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
  CARBON_MONOXIDE_SENSOR_DATA_LOADING,
} from '../constants';

const initialState = {
  error: '',
  events: [],
  info: { Name: '', Status: 0, Type: '' },
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CARBON_MONOXIDE_SENSOR_DATA_SUCCESS:
      return { ...action.payload, error: '', loading: false };
    case CARBON_MONOXIDE_SENSOR_DATA_LOADING:
      return { ...state, loading: true };
    case CARBON_MONOXIDE_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};
