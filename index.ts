import { createApi } from 'unsplash-js';
import * as nodeFetch from 'node-fetch';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const KEY = readFileSync(join(__dirname, '.pass'), 'utf8').trim();

function execPromise(command: string): Promise<void> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error displaying image: ${error.message}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error(stderr);
      }
      resolve();
    });
  });
}


async function main() {
  const unsplash = createApi({
    accessKey: KEY,
    fetch: nodeFetch.default as unknown as typeof fetch,
  });

  const resp = await unsplash.search.getPhotos({
    query: 'girl-fire-sea',
    page: 1,
    perPage: 10,
  });

  for (const photo of resp.response?.results || []) {
    if (photo.urls && photo.urls.small) {
      const command = `curl -s '${photo.urls.small}' | wezterm imgcat`;
      await new Promise((resolve) => setTimeout(resolve, 100));
      await execPromise(command);
    }
  }
}

main()
