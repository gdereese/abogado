const chalk = require('chalk');
const program = require('commander');

const logger = {
  error(text) {
    console.error(chalk.default.red(text));
  },

  info(text) {
    console.log(text);
  },

  verbose(text) {
    if (program.verbose) {
      console.log(text);
    }
  }
};

module.exports = logger;
