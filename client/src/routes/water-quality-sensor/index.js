import React from 'react';
import Layout from '../../components/Layout';
import WaterQualitySensor from '../../components/WaterQualitySensor/WaterQualitySensorContainer';
import setCurrentTab from '../../actions/menu';
import {
  getCurrentEvent,
  getEvents,
  getInfo,
  getWaterStructure,
} from '../../actions/water-quality';

const INTERVAL = 1000;

export default async function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Water Quality'));
  await dispatch(getInfo());

  const startEventsInterval = setInterval(() => {
    dispatch(getEvents());
    dispatch(getCurrentEvent());
  }, INTERVAL);
  dispatch(getWaterStructure());

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
