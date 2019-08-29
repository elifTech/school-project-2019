import { cleanDir } from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
export default function clean() {
  return Promise.all([
    cleanDir('build/*', {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    }),
  ]);
}
