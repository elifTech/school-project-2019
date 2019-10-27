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
    const {
      data: { Token: token },
    } = await axios.post(
      `${apiURL}/authenticate`,
      JSON.stringify({
        email,
        password,
      }),
    );
    if (token) {
      localStorage.setItem('token', token);
      dispatch(setUserMessage('You are logged in.'));
    } else {
      dispatch(setUserMessage('Sorry, try again!'));
    }
    setTimeout(resetMessage(), DELAY);
  } catch (error) {
    dispatch(setUserMessage('Invalid email or password.'));
    setTimeout(() => dispatch(resetMessage()), DELAY);
    console.error(error.message);
  }
};

export const signup = ({ email, password }) => async dispatch => {
  try {
    const { data: response } = await axios.post(
      `${apiURL}/register`,
      JSON.stringify({
        email,
        password,
      }),
    );
    if (response) {
      dispatch(setUserMessage('Successfully registered!'));
    } else {
      dispatch(setUserMessage(response));
    }
    setTimeout(() => dispatch(resetMessage()), DELAY);
  } catch (error) {
    dispatch(setUserMessage(error.message));
    setTimeout(() => dispatch(resetMessage()), DELAY);
    console.error(error.message);
  }
};

export const signout = () => dispatch => {
  localStorage.removeItem('token');
  history.push('/login');

  dispatch(setUserMessage('Signed out!'));
  setTimeout(() => dispatch(resetMessage()), DELAY);
};
