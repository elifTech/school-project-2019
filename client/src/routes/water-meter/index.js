import React from 'react';
import WaterMeter from './WaterMeter';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getWaterMeterEvents } from '../../actions/water-meter';

export default function action({ store: { dispatch } }) {
  const delay = 10000;
  dispatch(setCurrentTab('WaterConsumption'));
  const interval = setInterval(() => dispatch(getWaterMeterEvents()), delay);
  function resetInterval() {
    clearInterval(interval);
  }
  return {
    chunks: ['water-meter'],
    component: (
      <Layout>
        <WaterMeter handleUnmount={resetInterval} />
      </Layout>
    ),
    title: 'Water meter',
  };
}
