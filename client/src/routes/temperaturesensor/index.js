import React from 'react';
import TemperatureSensor from './temperature';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getTemperatureSensorData } from '../../actions/temperature';

const delay = 5000;

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Temperature'));
  const delayInterval = setInterval(() => {
    dispatch(getTemperatureSensorData());
  }, delay);

  function clearDelay() {
    clearInterval(delayInterval);
  }

  return {
    chunks: ['temperaturesensor'],
    component: (
      <Layout>
        <TemperatureSensor removeInterval={clearDelay} />
      </Layout>
    ),
    title: 'Temperature Sensor',
  };
}
