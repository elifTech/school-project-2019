import axios from 'axios';
import moment from 'moment';
import {
  REQUEST_WATERMETER_EVENTS,
  GOT_WATERMETER_EVENTS,
  FAIL_WATERMETER_EVENTS,
  UPDATE_WATERMETER_STATUS,
  LOADING_WATERMETER_STATUS,
  LOADING_FILTER_DATA,
} from '../constants';

export function getWaterMeterEventsRequest() {
  return {
    type: REQUEST_WATERMETER_EVENTS,
  };
}

export function getWaterMeterEventsSuccess(payload) {
  return {
    payload,
    type: GOT_WATERMETER_EVENTS,
  };
}

export function waterMeterEventsFailure(error) {
  return {
    error,
    type: FAIL_WATERMETER_EVENTS,
  };
}

export function updateWaterMeterStatus(status) {
  return {
    status,
    type: UPDATE_WATERMETER_STATUS,
  };
}

export function loadWaterMeterStatus() {
  return {
    type: LOADING_WATERMETER_STATUS,
  };
}

export function loadFilterData(period) {
  return {
    period,
    type: LOADING_FILTER_DATA,
  };
}

export function applyFilter({ from, value }) {
  return async dispatch => {
    dispatch(loadFilterData({ from, value }));
    try {
      const { data: events } = await axios.get(
        `http://localhost:8080/waterconsumption/events`,
        {
          params: {
            from,
            to: moment()
              .local()
              .toJSON(),
          },
        },
      );
      dispatch(getWaterMeterEventsSuccess({ events }));
    } catch (error) {
      dispatch(waterMeterEventsFailure(error.message));
    }
  };
}

export function changeWaterMeterStatus(status) {
  return async dispatch => {
    dispatch(loadWaterMeterStatus());
    try {
      const { data } = await axios.put(
        `http://localhost:8080/waterconsumption`,
        {
          status: status ? 1 : 0,
        },
      );
      const delay = 1000;
      setTimeout(() => dispatch(updateWaterMeterStatus(data)), delay);
    } catch (error) {
      dispatch(waterMeterEventsFailure(error.message));
    }
  };
}

export function getWaterMeterEvents() {
  return async (dispatch, getState) => {
    const {
      waterMeter: {
        info: { Name: name },
        filterOption: { from },
      },
    } = getState();
    if (!name) dispatch(getWaterMeterEventsRequest());
    const queries = [
      axios.get(`http://localhost:8080/waterconsumption/events`, {
        params: {
          from,
          to: moment()
            .local()
            .toJSON(),
        },
      }),
      !name && axios.get(`http://localhost:8080/waterconsumption`),
    ];

    try {
      const [{ data: events }, { data: info }] = await Promise.all(queries);
      dispatch(getWaterMeterEventsSuccess({ events, ...(info && { info }) }));
    } catch (error) {
      dispatch(waterMeterEventsFailure(error.message));
    }
  };
}
