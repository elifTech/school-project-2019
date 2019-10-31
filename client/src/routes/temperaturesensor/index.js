import React from 'react';
import TemperatureSensor from './Temperature';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getTemperatureSensorsData } from '../../actions/temperature';

const delay = 5000;

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Temperature'));
  const delayInterval = setInterval(() => {
    dispatch(getTemperatureSensorsData());
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
    title: 'Temperature',
  };
}
