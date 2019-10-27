import axios from 'axios';
import history from '../history';

const authHeader = {
  Authorization: `Bearer:${
    process.env.BROWSER ? localStorage.getItem('token') : ''
  }`,
};

const authorize = response => {
  if (response.Message) {
    localStorage.removeItem('token');
    history.push('/login');
  }
};

export default {
  async get(url, data) {
    const response = await axios.get(url, {
      headers: authHeader,
      params: data,
    });
    authorize(response.data);
    return response;
  },
  async post(url, data) {
    const response = await axios.post(url, JSON.stringify(data), {
      headers: { ...authHeader, 'Content-Type': 'application/json' },
    });
    authorize(response.data);
    return response;
  },
  async put(url, data) {
    const response = await axios.put(url, JSON.stringify(data), {
      headers: { ...authHeader, 'Content-Type': 'application/json' },
    });
    authorize(response.data);
    return response;
  },
};
