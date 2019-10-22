import moment from 'moment';
import {
  REQUEST_WATERMETER_EVENTS,
  GOT_WATERMETER_EVENTS,
  FAIL_WATERMETER_EVENTS,
  UPDATE_WATERMETER_STATUS,
  LOADING_WATERMETER_STATUS,
  LOADING_FILTER_DATA,
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
    value: 'day',
  },
  info: { Name: '', Status: 0, Type: '' },
  loading: true,
  statusLoading: false,
};

export default function waterMeter(state = initialState, action) {
  switch (action.type) {
    case REQUEST_WATERMETER_EVENTS:
      return {
        ...state,
        loading: true,
      };
    case GOT_WATERMETER_EVENTS:
      return {
        ...state,
        ...action.payload,
        error: '',
        filterLoading: false,
        loading: false,
      };

    case FAIL_WATERMETER_EVENTS:
      return {
        ...state,
        error: action.error,
        loading: false,
      };

    case UPDATE_WATERMETER_STATUS:
      return {
        ...state,
        info: { ...state.info, Status: action.status },
        statusLoading: false,
      };

    case LOADING_WATERMETER_STATUS:
      return {
        ...state,
        statusLoading: true,
      };

    case LOADING_FILTER_DATA:
      return {
        ...state,
        filterLoading: true,
        filterOption: { from: action.period.from, value: action.period.value },
      };
    default:
      return state;
  }
}
