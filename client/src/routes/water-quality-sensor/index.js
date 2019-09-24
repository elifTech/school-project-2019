import React from 'react';
import Layout from '../../components/Layout';
import WaterQualitySensor from './WaterQualitySensor';

export default function action() {
  return {
    chunks: ['water-quality-sensor'],
    component: (
      <Layout>
        <WaterQualitySensor />
      </Layout>
    ),
    title: 'Water quality sensor',
  };
}
