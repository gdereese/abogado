const chalk = require('chalk');

let isVerbose = false;

const logger = {
  error(text) {
    console.error(chalk.default.red(text));
  },

  info(text) {
    console.log(text);
  },

  initialize(settings) {
    isVerbose = settings.verbose;
  },

  verbose(text) {
    if (isVerbose) {
      console.log(text);
    }
  }
};

module.exports = logger;
