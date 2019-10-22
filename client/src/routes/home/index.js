import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default function action() {
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
