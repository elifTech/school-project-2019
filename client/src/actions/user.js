/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';
import { SET_CURRENT_USER, SET_USER_MESSAGE, apiURL } from '../constants';

const setUser = username => ({
  payload: {
    message: 'You are loggen in.',
    username,
  },
  type: SET_CURRENT_USER,
});

const setUserMessage = message => ({
  message,
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
    console.log(token);
    if (token) {
      localStorage.setItem('token', token);
      dispatch(setUser(email));
    } else {
      dispatch(setUser(''));
    }
  } catch (error) {
    dispatch(setUserMessage(error.message));
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
      dispatch(setUserMessage('User succesfully created!'));
    } else {
      dispatch(setUserMessage(response));
    }
  } catch (error) {
    dispatch(setUserMessage(error.message));
    console.error(error.message);
  }
};
