import React from 'react';
import LoginPage from './LoginPage';

export default function action() {
  return {
    chunks: ['login'],
    component: <LoginPage />,
    title: 'Login',
  };
}
