const fs = require('fs');
const _ = require('lodash');

const logger = require('./logger');
const Settings = require('./settings');

const settingsProvider = {
  getSettings(settingsFilePath, commandLineArgs) {
    let fileSettings = null;

    if (fs.existsSync(settingsFilePath)) {
      fileSettings = JSON.parse(fs.readFileSync(settingsFilePath).toString());

      logger.verbose(`Using policy settings from file '${settingsFilePath}'.`);
    } else {
      logger.verbose(
        'No policy settings file found in package directory, assuming defaults.'
      );
    }

    // there's currently a minor impedance mismatch between the command-line parameters and the settings schema;
    // align to the schema before proceeding
    const commandLineSettings = _.assign({}, commandLineArgs);
    let policy = null;
    if (commandLineSettings.allow) {
      policy = {};
      policy.allow = {
        licenses: commandLineSettings.allow
      };
    }
    if (commandLineSettings.deny) {
      policy = policy || {};
      policy.deny = {
        licenses: commandLineSettings.deny
      };
    }
    if (policy) {
      commandLineSettings.policy = policy;
    }

    return new Settings(_.assign(fileSettings, commandLineSettings));
  }
};

module.exports = settingsProvider;
