import React from 'react';
import Layout from '../../components/Layout';
import WaterQualitySensor from '../../containers/WaterQualitySensor';
import setCurrentTab from '../../actions/menu';
import { getEvents, getInfo } from '../../actions/water-quality';

const INTERVAL = 3000;

export default async function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Water Quality'));
  await dispatch(getInfo());

  const startEventsInterval = setInterval(
    () => dispatch(getEvents()),
    INTERVAL,
  );
  function resetEventsInterval() {
    clearInterval(startEventsInterval);
  }

  return {
    chunks: ['water-quality-sensor'],
    component: (
      <Layout>
        <WaterQualitySensor resetInterval={resetEventsInterval} />
      </Layout>
    ),
    title: 'Water quality sensor',
  };
}
