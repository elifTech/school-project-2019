import React from 'react';
import Layout from '../../components/Layout';
import LoginPage from './LoginPage';

export default function action() {
  return {
    chunks: ['login'],
    component: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
    title: 'Login',
  };
}
