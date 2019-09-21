import React from 'react';
import Listener from './Listener';
import Layout from '../../components/Layout';
import setUserData from '../../actions/user';

export default function action({ store: { dispatch } }) {
  dispatch(
    setUserData({
      apiKey: '991eacc4ca058d68ec446983c0ddd04d',
      username: 'UNDEADUM',
    }),
  );
  return {
    chunks: ['listener'],
    component: (
      <Layout>
        <Listener />
      </Layout>
    ),
    title: 'Listener',
  };
}
