#!/usr/bin/env node
'use strict';
const { execSync } = require('child_process');

try {
  execSync('npm install', { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to install dependencies:', err.message);
  process.exit(1);
}
