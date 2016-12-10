#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { download } = require('..');

const targetDir = path.resolve(process.cwd(), process.argv.length === 3 ? process.argv[2] : '');

fs.accessSync(targetDir, fs.constants.W_OK);

download(targetDir);
