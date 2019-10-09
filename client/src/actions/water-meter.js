import axios from 'axios';
import {
  REQUEST_WATERMETER_EVENTS,
  FAIL_WATERMETER_EVENTS,
  GOT_WATERMETER_EVENTS,
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

export function getWaterMeterEventsFailure(error) {
  return {
    error,
    type: FAIL_WATERMETER_EVENTS,
  };
}

export function getWaterMeterEvents(period = 'month') {
  return async dispatch => {
    dispatch(getWaterMeterEventsRequest());
    try {
      const { data: waterMeterEvents } = await axios.get(
        `http://localhost:8080//waterconsumtion/${period}`,
      );
      console.info({ waterMeterEvents });
      // const {
      //   message: error = null,
      //   watermeterevents: waterMeterEvents,
      // } = await response.json();
      // if (!waterMeterEvents) {
      //   throw error;
      // }+
      return dispatch(getWaterMeterEventsSuccess({ waterMeterEvents }));
    } catch (error) {
      return dispatch(getWaterMeterEventsFailure(error));
    }
  };
}
