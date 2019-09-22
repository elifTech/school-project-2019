/* eslint-disable import/prefer-default-export */

import { SET_RUNTIME_VARIABLE } from '../constants';

export function setRuntimeVariable({ name, value }) {
  return {
    payload: {
      name,
      value,
    },
    type: SET_RUNTIME_VARIABLE,
  };
}
