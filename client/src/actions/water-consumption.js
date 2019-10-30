import axios from 'axios';
import moment from 'moment';
import {
  REQUEST_WATERCONSUMPTION_EVENTS,
  GOT_WATERCONSUMPTION_EVENTS,
  FAIL_WATERCONSUMPTION_EVENTS,
  UPDATE_WATERCONSUMPTION_STATUS,
  LOADING_WATERCONSUMPTION_STATUS,
  LOADING_FILTER_DATA,
} from '../constants';

export function getWaterConsumptionEventsRequest() {
  return {
    type: REQUEST_WATERCONSUMPTION_EVENTS,
  };
}

export function fetchWaterConsumptionEventsSuccess(payload) {
  return {
    payload,
    type: GOT_WATERCONSUMPTION_EVENTS,
  };
}

export function waterConsumptionEventsFailure(error) {
  return {
    error,
    type: FAIL_WATERCONSUMPTION_EVENTS,
  };
}

export function updateWaterConsumptionStatus(status) {
  return {
    status,
    type: UPDATE_WATERCONSUMPTION_STATUS,
  };
}

export function fetchWaterConsumptionStatus() {
  return {
    type: LOADING_WATERCONSUMPTION_STATUS,
  };
}

export function loadFilterData(period) {
  return {
    period,
    type: LOADING_FILTER_DATA,
  };
}

export function setBoundaries({ from, value }) {
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
      dispatch(fetchWaterConsumptionEventsSuccess({ events }));
    } catch (error) {
      dispatch(waterConsumptionEventsFailure(error.message));
    }
  };
}

export function changeWaterConsumptionStatus(status) {
  return async dispatch => {
    dispatch(fetchWaterConsumptionStatus());
    try {
      const { data } = await axios.put(
        `http://localhost:8080/waterconsumption`,
        {
          status: status ? 1 : 0,
        },
      );
      const delay = 1000;
      setTimeout(() => dispatch(updateWaterConsumptionStatus(data)), delay);
    } catch (error) {
      dispatch(waterConsumptionEventsFailure(error.message));
    }
  };
}

export function getWaterConsumptionEvents() {
  return async (dispatch, getState) => {
    const {
      waterConsumption: {
        info: { Name: name },
        filterOption: { from },
      },
    } = getState();
    if (!name) dispatch(getWaterConsumptionEventsRequest());
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
      dispatch(
        fetchWaterConsumptionEventsSuccess({ events, ...(info && { info }) }),
      );
    } catch (error) {
      dispatch(waterConsumptionEventsFailure(error.message));
    }
  };
}

export function alertWaterConsumptionStatus() {
  return async dispatch => {
    dispatch(fetchWaterConsumptionStatus());
    try {
      const { data } = await axios.put(
        `http://localhost:8080/waterconsumption`,
        {
          status: 2,
        },
      );
      const delay = 1000;
      setTimeout(() => dispatch(updateWaterConsumptionStatus(data)), delay);
    } catch (error) {
      dispatch(waterConsumptionEventsFailure(error.message));
    }
  };
}

export function getAllWaterConsumptionEvents() {
  return async (dispatch, getState) => {
    const {
      waterConsumption: {
        info: { Name: name },
      },
    } = getState();
    if (!name) dispatch(getWaterConsumptionEventsRequest());
    const queries = [
      axios.get(`http://localhost:8080/waterconsumption/all`),
      !name && axios.get(`http://localhost:8080/waterconsumption`),
    ];

    try {
      const [{ data: events }, { data: info }] = await Promise.all(queries);
      dispatch(
        fetchWaterConsumptionEventsSuccess({ events, ...(info && { info }) }),
      );
    } catch (error) {
      dispatch(waterConsumptionEventsFailure(error.message));
    }
  };
}
