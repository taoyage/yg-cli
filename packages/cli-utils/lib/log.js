const log = require('npmlog');

// 通过环境变量来设置log的level
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

// 添加log前缀
log.heading = '@taoyage/cli';

// 添加log自定义命令
log.addLevel('success', 2000, { fg: 'green', bold: true });

module.exports = log;
