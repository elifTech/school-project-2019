import {
  CARBON_MONOXIDE_SENSOR_DATA_SUCCESS,
  CARBON_MONOXIDE_SENSOR_DATA_FAILURE,
  CARBON_MONOXIDE_SENSOR_DATA_LOADING,
  CARBON_MONOXIDE_SENSOR_STATUS_UPDATE,
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
      return { ...state, ...action.payload, error: '', loading: false };
    case CARBON_MONOXIDE_SENSOR_STATUS_UPDATE:
      return {
        ...state,
        info: { ...state.info, Status: action.status },
        statusLoading: false,
      };
    case CARBON_MONOXIDE_SENSOR_DATA_LOADING:
      return { ...state, loading: true };
    case CARBON_MONOXIDE_SENSOR_DATA_FAILURE:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};
