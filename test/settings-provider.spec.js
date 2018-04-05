const fs = require('fs');

const settingsProvider = require('../src/settings-provider');

describe('settings-provider', () => {
  it('maps all settings from command-line arguments', () => {
    const settingsFilePath = '';
    const commandLineArgs = {
      allowLicenses: ['foo', 'bar'],
      allowPackages: ['abc', 'def'],
      denyLicenses: ['baz', 'qux'],
      denyPackages: ['ghi', 'jkl'],
      outputPath: 'path/to/stuff',
      verbose: true
    };

    const settings = settingsProvider.getSettings(
      settingsFilePath,
      commandLineArgs
    );

    expect(settings.outputPath).toEqual(commandLineArgs.outputPath);

    expect(settings.policy.allow.licenses).toEqual(
      commandLineArgs.allowLicenses
    );
    expect(settings.policy.allow.packages).toEqual(
      commandLineArgs.allowPackages
    );
    expect(settings.policy.deny.licenses).toEqual(commandLineArgs.denyLicenses);
    expect(settings.policy.deny.packages).toEqual(commandLineArgs.denyPackages);

    expect(settings.verbose).toEqual(commandLineArgs.verbose);
  });

  it('maps all settings from file', () => {
    const settingsFilePath = './test/fixtures/abogado_test.json';

    const settings = settingsProvider.getSettings(settingsFilePath);

    const fileSettings = JSON.parse(
      fs.readFileSync(settingsFilePath).toString()
    );

    expect(settings.outputPath).toEqual(fileSettings.outputPath);

    expect(settings.policy.allow.licenses).toEqual(
      fileSettings.policy.allow.licenses
    );
    expect(settings.policy.allow.packages).toEqual(
      fileSettings.policy.allow.packages
    );
    expect(settings.policy.deny.licenses).toEqual(
      fileSettings.policy.deny.licenses
    );
    expect(settings.policy.deny.packages).toEqual(
      fileSettings.policy.deny.packages
    );

    expect(settings.verbose).toBe(fileSettings.verbose);
  });

  it('overrides file settings with command-line arguments when present', () => {
    const settingsFilePath = './test/fixtures/abogado_test.json';
    const commandLineArgs = {
      outputPath: 'path/to/thing'
    };

    const settings = settingsProvider.getSettings(
      settingsFilePath,
      commandLineArgs
    );

    const fileSettings = JSON.parse(
      fs.readFileSync(settingsFilePath).toString()
    );

    expect(settings.outputPath).toEqual(commandLineArgs.outputPath);

    expect(settings.policy.allow.licenses).toEqual(
      fileSettings.policy.allow.licenses
    );
    expect(settings.policy.allow.packages).toEqual(
      fileSettings.policy.allow.packages
    );
    expect(settings.policy.deny.licenses).toEqual(
      fileSettings.policy.deny.licenses
    );
    expect(settings.policy.deny.packages).toEqual(
      fileSettings.policy.deny.packages
    );

    expect(settings.verbose).toEqual(fileSettings.verbose);
  });
});
