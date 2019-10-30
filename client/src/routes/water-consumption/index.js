import React from 'react';
import WaterConsumption from './WaterConsumption';
import Layout from '../../components/Layout';
import setCurrentTab from '../../actions/menu';
import { getWaterConsumptionEvents } from '../../actions/water-consumption';

export default function action({ store: { dispatch } }) {
  const delay = 2000;
  dispatch(setCurrentTab('Water Cons'));
  const interval = setInterval(
    () => dispatch(getWaterConsumptionEvents()),
    delay,
  );
  function resetInterval() {
    clearInterval(interval);
  }
  return {
    chunks: ['water-consumption'],
    component: (
      <Layout>
        <WaterConsumption handleUnmount={resetInterval} />
      </Layout>
    ),
    title: 'Water consumption',
  };
}
