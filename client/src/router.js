/* eslint-disable promise/prefer-await-to-then */
import UniversalRouter from 'universal-router';
import routes from './routes';

const router = new UniversalRouter(routes, {
  resolveRoute(context, parameters) {
    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        .then(action => action.default(context, parameters));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, parameters);
    }
    return undefined;
  },
});

export default router;
