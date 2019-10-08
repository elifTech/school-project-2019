import React from 'react';
import Layout from '../../components/Layout';
import NotFound from './NotFound';
import setCurrentTab from '../../actions/menu';

const title = 'Page Not Found';

export default function action({ store: { dispatch } }) {
  dispatch(setCurrentTab(''));
  return {
    chunks: ['not-found'],
    component: (
      <Layout>
        <NotFound title={title} />
      </Layout>
    ),
    status: 404,
    title,
  };
}
