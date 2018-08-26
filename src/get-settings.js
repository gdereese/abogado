const fs = require('fs');
const jsonFile = require('jsonfile');
const _ = require('lodash');

const Settings = require('./settings');

function getSettings(settingsFilePath, commandLineArgs) {
  let fileSettings = null;
  if (fs.existsSync(settingsFilePath)) {
    fileSettings = jsonFile.readFileSync(settingsFilePath);
  }

  // there's currently a minor impedance mismatch between the command-line parameters and the settings schema;
  // align to the schema before proceeding
  const commandLineSettings = Object.assign({}, commandLineArgs);
  if (commandLineSettings.allowLicenses) {
    _.set(
      commandLineSettings,
      'policy.allow.licenses',
      commandLineSettings.allowLicenses
    );
  }
  if (commandLineSettings.allowPackages) {
    _.set(
      commandLineSettings,
      'policy.allow.packages',
      commandLineSettings.allowPackages
    );
  }
  if (commandLineSettings.denyLicenses) {
    _.set(
      commandLineSettings,
      'policy.deny.licenses',
      commandLineSettings.denyLicenses
    );
  }
  if (commandLineSettings.denyPackages) {
    _.set(
      commandLineSettings,
      'policy.deny.packages',
      commandLineSettings.denyPackages
    );
  }

  return new Settings(Object.assign(fileSettings || {}, commandLineSettings));
}

module.exports = getSettings;
