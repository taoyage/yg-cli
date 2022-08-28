const axios = require('axios');
const semver = require('semver');

const cacheData = {};

/**
 * 从 registry 获取 npm 信息
 */
function getNpmInfo(npm) {
  if (cacheData[npm]) {
    return Promise.resolve(cacheData[npm]);
  }

  const registry = 'https://registry.npm.taobao.org';
  const url = `${registry}/${npm}`;

  return axios
    .get(url)
    .then((response) => {
      cacheData[npm] = response.data;
      return response.data;
    })
    .catch((err) => {
      Promise.reject(err);
    });
}

/**
 * 根据指定 version 获取符合 semver 规范的最新版本号
 *
 * @param {String} baseVersion 指定的基准 version
 * @param {Array} versions
 */
function getLatestSemverVersion(baseVersion, versions) {
  const version = versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));

  return version[0];
}

/**
 * 根据指定 version 和包名获取符合 semver 规范的最新版本号
 *
 * @param {String} npm 包名
 * @param {String} baseVersion 指定的基准 version
 */
function getNpmLatestSemverVersion(npm, baseVersion) {
  return getNpmInfo(npm)
    .then((body) => Object.keys(body.versions))
    .then((versions) => getLatestSemverVersion(baseVersion, versions));
}

module.exports = function (packageName, packageVersion) {
  return getNpmLatestSemverVersion(packageName, packageVersion).then((latestVersion) => {
    if (latestVersion && semver.lt(packageVersion, latestVersion)) {
      return Promise.resolve(latestVersion);
    }
  });
};
