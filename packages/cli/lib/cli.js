'use strict';

const chalk = require('chalk');
const semver = require('semver');
const userHome = require('user-home');
const pathExists = require('path-exists');
const boxen = require('boxen');

const { log, checkVersion } = require('@taoyage/cli-utils');

const pkg = require('../package.json');

function main(argv) {
  // 打印 CLI 版本
  logCLIVersion();

  // 检查 Node 版本
  checkNodeVersion();

  // 检查用户主目录
  checkUserHome();

  // 检查是否为最新版本
  checkCLIVersion();
}

function logCLIVersion() {
  log.info('cli', pkg.version);
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const targetVersion = pkg.engines.node;

  if (!semver.satisfies(currentVersion, targetVersion)) {
    console.error(
      chalk.red(
        'You are running Node %s.\n@taoyage/cli requires Node %s or higher.\nPlease update your version of Node.'
      ),
      process.version,
      pkg.engines.node
    );

    process.exit(1);
  }
}

function checkUserHome() {
  if (!userHome || !pathExists.sync(userHome)) {
    console.error(chalk.red('user home path does not exist.'));
    process.exit(1);
  }
}

async function checkCLIVersion() {
  const packageName = pkg.name;
  const packageVersion = pkg.version;

  try {
    const latestVersion = await checkVersion(packageName, packageVersion);
    if (!latestVersion) {
      return;
    }

    const boxenText =
      'Update available ' +
      chalk.dim(packageVersion) +
      chalk.reset(' → ') +
      chalk.green(latestVersion) +
      ' \nRun ' +
      chalk.cyan('npm install -g @taoyage/cli') +
      ' to update';

    const boxenOptions = {
      align: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
      margin: 1,
      padding: 1,
    };

    const message = '\n' + boxen(boxenText, boxenOptions);

    console.log(message);
  } catch (err) {
    console.log(chalk.red('Failed to check for updates'));
  }
}

module.exports = main;
