function createLogger(options = {}) {
  return {
    error(str) {
      err(str || '', (options.chalk || {}).red);
    },

    info(str) {
      log(str || '');
    },

    verbose(str) {
      if (options.isVerbose) {
        log(str || '');
      }
    },

    warn(str) {
      log(str || '', (options.chalk || {}).yellowBright);
    }
  };
}

function err(str, chalk) {
  console.error(chalk ? chalk(str) : str);
}

function log(str, chalk) {
  console.log(chalk ? chalk(str) : str);
}

module.exports = createLogger;
