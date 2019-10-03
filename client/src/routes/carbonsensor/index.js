import React from 'react';
import CarbonSensor from './carbon';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import getCarbonSensorData from '../../actions/carbonmonoxide';

const delay = 5000;

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Carbon Monoxide'));
  const delayInter = setInterval(() => {
    dispatch(getCarbonSensorData());
  }, delay);

  function handleanmount() {
    clearInterval(delayInter);
  }

  return {
    chunks: ['carbonsensor'],
    component: (
      <Layout>
        <CarbonSensor handleanmount={handleanmount} />
      </Layout>
    ),
    title: 'Carbon Monoxide Sensor',
  };
}
