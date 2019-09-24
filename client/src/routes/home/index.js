import React from 'react';
import Dashboard from './Dashboard';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Dashboard'));
  return {
    chunks: ['home'],
    component: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    title: 'Smart Things Dashboard',
  };
}
