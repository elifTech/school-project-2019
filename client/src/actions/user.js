/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable unicorn/consistent-function-scoping */
import axios from 'axios';
import isomorphicCookie from 'isomorphic-cookie';
import moment from 'moment';
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

export const login = ({ email, password }) => dispatch => {
  setTimeout(() => dispatch(resetMessage()), DELAY);
  const cookieExpires = 60;
  return axios
    .post(
      `${apiURL}/authenticate`,
      JSON.stringify({
        email,
        password,
      }),
    )
    .then(response => {
      isomorphicCookie.save('user_token', response.data.Token, {
        expires: moment()
          .add(cookieExpires, 'minute')
          .toDate(),
        secure: false,
      });
      return dispatch(setUserMessage('You are logged in.'));
    })
    .catch(error => {
      const { response } = error;
      if (response) dispatch(setUserMessage(response.data));
      return error.toJSON();
    });
};

export const signup = ({ email, password }) => dispatch => {
  setTimeout(() => dispatch(resetMessage()), DELAY);
  return axios
    .post(
      `${apiURL}/register`,
      JSON.stringify({
        email,
        password,
      }),
    )
    .then(response => {
      dispatch(setUserMessage(response.data));
      return response;
    })
    .catch(error => {
      dispatch(setUserMessage(error.response.data));
      return error.toJSON();
    });
};

export const signout = () => dispatch => {
  isomorphicCookie.remove('user_token');
  history.push('/login');
  dispatch(setUserMessage('Signed out!'));
  setTimeout(() => dispatch(resetMessage()), DELAY);
};
