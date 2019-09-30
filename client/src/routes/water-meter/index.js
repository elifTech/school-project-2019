import React from 'react';
import WaterMeter from './WaterMeter';
import Layout from '../../components/Layout';
import { getWaterMeterEvents } from '../../actions/water-meter';

export default function action({ store: { dispatch } }) {
  dispatch(getWaterMeterEvents());
  return {
    chunks: ['water-meter'],
    component: (
      <Layout>
        <WaterMeter />
      </Layout>
    ),
    title: 'Water meter',
  };
}
