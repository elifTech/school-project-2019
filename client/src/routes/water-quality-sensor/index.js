import React from 'react';
import Layout from '../../components/Layout';
import WaterQualitySensor from '../../containers/WaterQualitySensor';
import setCurrentTab from '../../actions/menu';
import { getEvents, getInfo } from '../../actions/water-quality';

export default async function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Water Quality'));
  await dispatch(getInfo());

  const interval = 3000;
  const startEventsInterval = setInterval(
    () => dispatch(getEvents()),
    interval,
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
