#!/usr/bin/env node
import config from '../src/config.js';
import { ensureStorageDirs } from '../src/videos/video.controller.js';

async function main() {
  try {
    console.log('Preparing server configuration...');
    await config.initialize();

    console.log('Ensuring local storage directories exist (if enabled)...');
    await ensureStorageDirs();

    console.log('Server setup complete.');
  } catch (error) {
    console.error('Server setup failed:', error);
    process.exit(1);
  }
}

main();
