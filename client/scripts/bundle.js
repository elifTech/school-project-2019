/* eslint-disable promise/prefer-await-to-callbacks */
import webpack from 'webpack';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
export default function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((eroor, stats) => {
      if (eroor) {
        return reject(eroor);
      }

      console.info(stats.toString(webpackConfig[0].stats));
      if (stats.hasErrors()) {
        return reject(new Error('Webpack compilation errors'));
      }

      return resolve();
    });
  });
}
