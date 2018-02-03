import * as program from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';

import { Policy } from './policy';
import { Settings } from './settings';

export function getSettings(settingsFilePath: string): Settings {
  const settings = new Settings();

  if (fs.existsSync(settingsFilePath)) {
    const fileSettings = JSON.parse(
      fs.readFileSync(settingsFilePath).toString()
    );
    _.assign(settings, fileSettings);
  }

  if (program.allow !== undefined) {
    if (!settings.policy) {
      settings.policy = new Policy();
    }
    settings.policy.allow = {
      licenses: program.allow
    };
  }
  if (program.deny !== undefined) {
    if (!settings.policy) {
      settings.policy = new Policy();
    }
    settings.policy.deny = {
      licenses: program.deny
    };
  }
  if (program.outputPath !== undefined) {
    settings.outputPath = program.outputPath;
  }
  if (program.verbose !== undefined) {
    settings.verbose = program.verbose;
  }

  return settings;
}
