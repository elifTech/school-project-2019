import React from 'react';
import Dashboard from './Dashboard';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getCurrentEvent, getInfo } from '../../actions/water-quality';
import { getCarbonSensorsData } from '../../actions/carbonmonoxide';
import { getTemperatureSensorsData } from '../../actions/temperature';

const INTERVAL = 2000;

export default async function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Dashboard'));
  await dispatch(getInfo());

  const startIntervalInitialData = setInterval(() => {
    dispatch(getCurrentEvent());
    dispatch(getCarbonSensorsData());
    dispatch(getTemperatureSensorsData());
  }, INTERVAL);

  function resetInitialDataInterval() {
    clearInterval(startIntervalInitialData);
  }

  return {
    chunks: ['dashboard'],
    component: (
      <Layout>
        <Dashboard resetInterval={resetInitialDataInterval} />
      </Layout>
    ),
    title: 'Smart Things Dashboard',
  };
}
