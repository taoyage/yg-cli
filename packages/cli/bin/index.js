#! /usr/bin/env node

const importLocal = require('import-local');
const main = require('../lib/cli');
const { log } = require('@taoyage/cli-utils');

if (importLocal(__filename)) {
  log.info('cli', 'using local version of yg-cli');
} else {
  main(process.argv.slice(2));
}
