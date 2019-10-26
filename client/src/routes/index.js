/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'}`;
    route.description = route.description || '';

    return route;
  },

  // Keep in mind, routes are evaluated in order
  children: [
    {
      load: () => import(/* webpackChunkName: 'dashboard' */ './dashboard'),
      path: '',
    },
    {
      load: () => import(/* webpackChunkName: 'wind' */ './wind'),

      path: '/wind',
    },
    {
      load: () =>
        import(
          /* webpackChunkName: 'water-quality-sensor' */ './water-quality-sensor'
        ),
      path: '/water-quality',
    },
    {
      load: () =>
        import(/* webpackChunkName: 'carbonsensor' */ './carbonsensor'),
      path: '/carbonmonoxide',
    },
    {
      load: () => import(/* webpackChunkName: 'water-meter' */ './water-meter'),
      path: '/water-meter',
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
      path: '(.+)',
    },
  ],

  path: '',
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    action: require('./error').default,
    path: '/error',
  });
}

export default routes;
