import React from 'react';
import ErrorPage from './ErrorPage';

export default function action() {
  return {
    title: 'Demo Error',
    component: <ErrorPage />,
  };
}
