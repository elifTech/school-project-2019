import React from 'react';
import SignupPage from './SignupPage';

export default function action() {
  return {
    chunks: ['signup'],
    component: <SignupPage />,
    title: 'Signup',
  };
}
