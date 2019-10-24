/* eslint-disable global-require */
import React from 'react';
import AuthContainer from '../components/Authorization';

const routes = [
  {
    load: () => import(/* webpackChunkName: 'login' */ './login'),
    path: '/login',
  },
  {
    load: () => import(/* webpackChunkName: 'signup' */ './signup'),
    path: '/signup',
  },
  {
    async action({ next }) {
      // Execute each child route until one of them return the result
      const route = await next();
      route.component = <AuthContainer>{route.component}</AuthContainer>;

      // Provide default values for title, description etc.
      route.title = `${route.title || 'Untitled Page'}`;
      route.description = route.description || '';

      return route;
    },

    // Keep in mind, routes are evaluated in order
    children: [
      {
        load: () => import(/* webpackChunkName: 'home' */ './home'),
        path: '',
      },
      {
        load: () => import(/* webpackChunkName: 'wind' */ './wind'),
        path: '/wind',
      },

      // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
      {
        load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
        path: '(.+)',
      },
    ],

    path: '',
    protected: true,
  },
];

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes[2].children.unshift({
    action: require('./error').default,
    path: '/error',
  });
}

export default routes;
