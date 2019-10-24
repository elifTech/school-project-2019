import React from 'react';
import Wind from './Wind';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getWindSensorData } from '../../actions/wind-sensor';

export default function action({ store: { dispatch } }) {
  const delay = 5000;
  dispatch(setCurrentTab('Wind'));
  const interval = setInterval(() => dispatch(getWindSensorData()), delay);
  function resetInterval() {
    clearInterval(interval);
  }

  return {
    chunks: ['wind'],
    component: (
      <Layout>
        <Wind handleUnmount={resetInterval} />
      </Layout>
    ),
    title: 'Wind Sensor',
  };
}
