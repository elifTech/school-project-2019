import React from 'react';
import CarbonSensor from './carbon';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getCarbonSensorsData } from '../../actions/carbonmonoxide';

const delay = 5000;

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Carbon Monoxide'));
  const delayInterval = setInterval(() => {
    dispatch(getCarbonSensorsData());
  }, delay);

  function clearDelay() {
    clearInterval(delayInterval);
  }

  return {
    chunks: ['carbonsensor'],
    component: (
      <Layout>
        <CarbonSensor removeInterval={clearDelay} />
      </Layout>
    ),
    title: 'Carbon Monoxide Sensor',
  };
}
