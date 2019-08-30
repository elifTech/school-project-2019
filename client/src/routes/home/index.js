import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default function action() {
  return {
    title: 'ElifTech School 2019 Project',
    chunks: ['home'],
    component: (
      <Layout>
        <Home />
      </Layout>
    ),
  };
}
