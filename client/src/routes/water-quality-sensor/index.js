import React from 'react';
import Layout from '../../components/Layout';
import WaterQualitySensor from '../../containers/WaterQualitySensor';
import setCurrentTab from '../../actions/menu';

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab('Water Quality'));
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
