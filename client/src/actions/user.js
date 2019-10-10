import { SET_USER_DATA } from '../constants';

export default function setUserData(userData) {
  return {
    type: SET_USER_DATA,
    ...userData,
  };
}
