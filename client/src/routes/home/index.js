import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Dashboard'));
  return {
    chunks: ['home'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
    title: 'ElifTech School 2019 Project',
  };
}
