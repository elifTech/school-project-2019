/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';
import history from '../history';
import { SET_USER_MESSAGE, apiURL } from '../constants';

const setUserMessage = message => ({
  message,
  type: SET_USER_MESSAGE,
});

const DELAY = 3000;

const resetMessage = () => ({
  message: '',
  type: SET_USER_MESSAGE,
});

export const login = ({ email, password }) => async dispatch => {
  try {
    const StatusOK = 200;
    const response = await axios.post(
      `${apiURL}/authenticate`,
      JSON.stringify({
        email,
        password,
      }),
    );
    if (response.status === StatusOK) {
      dispatch(setUserMessage('You are logged in.'));
    } else {
      dispatch(setUserMessage('Sorry, try again!'));
    }
    setTimeout(() => dispatch(resetMessage()), DELAY);
  } catch (error) {
    dispatch(setUserMessage('Invalid email or password.'));
    setTimeout(() => dispatch(resetMessage()), DELAY);
    console.error(error.message);
  }
};

export const signup = ({ email, password }) => async dispatch => {
  try {
    const response = await axios.post(
      `${apiURL}/register`,
      JSON.stringify({
        email,
        password,
      }),
    );
    dispatch(setUserMessage(response.data));
    setTimeout(() => dispatch(resetMessage()), DELAY);
    return response;
  } catch (error) {
    dispatch(setUserMessage(error.message));
    setTimeout(() => dispatch(resetMessage()), DELAY);
    return error;
  }
};

export const signout = () => dispatch => {
  history.push('/login');

  dispatch(setUserMessage('Signed out!'));
  setTimeout(() => dispatch(resetMessage()), DELAY);
};
