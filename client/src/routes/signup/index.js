import React from 'react';
import Layout from '../../components/Layout';
import SignupPage from './SignupPage';

export default function action() {
  return {
    chunks: ['signup'],
    component: (
      <Layout>
        <SignupPage />
      </Layout>
    ),
    title: 'Signup',
  };
}
