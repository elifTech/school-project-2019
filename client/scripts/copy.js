import path from 'path';
import chokidar from 'chokidar';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import pkg from '../package.json';
import { format } from './run';

const JSON_SPACE_NUM = 2;

async function handleChange(event, dist, filePath) {
  switch (event) {
    case 'add':
    case 'change':
      await makeDir(path.dirname(dist));
      await copyFile(filePath, dist);
      break;
    case 'unlink':
    case 'unlinkDir':
      cleanDir(dist, { nosort: true, dot: true });
      break;
    default:
  }
}

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
export default async function copy() {
  await makeDir('build');
  await Promise.all([
    writeFile(
      'build/package.json',
      JSON.stringify(
        {
          private: true,
          engines: pkg.engines,
          dependencies: pkg.dependencies,
          scripts: {
            start: 'node server.js',
          },
        },
        null,
        JSON_SPACE_NUM,
      ),
    ),
    copyFile('../LICENSE', 'build/LICENSE.txt'),
    copyFile('yarn.lock', 'build/yarn.lock'),
    copyDir('public', 'build/public'),
  ]);

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch(['public/**/*'], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join(
        'build/',
        src.startsWith('src') ? path.relative('src', src) : src,
      );
      await handleChange(event, dist, filePath);
      const end = new Date();
      const time = end.getTime() - start.getTime();
      console.info(`[${format(end)}] ${event} '${dist}' after ${time} ms`);
    });
  }
}
