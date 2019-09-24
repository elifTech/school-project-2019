import React from 'react';
import Wind from './Wind';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import getWindSensorData from '../../actions/wind-sensor';

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Wind'));
  dispatch(getWindSensorData());
  return {
    chunks: ['wind'],
    component: (
      <Layout>
        <Wind />
      </Layout>
    ),
    title: 'Wind Sensor',
  };
}
