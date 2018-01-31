import * as program from 'commander';
import * as fs from 'fs';

import * as settingsProvider from '../src/settings-provider';

describe('settings-provider', () => {
  it('maps all settings from command-line parameters', () => {
    program.allow = ['foo', 'bar'];
    program.deny = ['baz', 'qux'];
    program.outputPath = 'path/to/stuff';
    program.verbose = true;

    const settingsFilePath = '';

    const settings = settingsProvider.getSettings(settingsFilePath);

    expect(settings.outputPath).toBe(program.outputPath);
    expect(settings.policy.allow.licenses).toEqual(
      jasmine.arrayWithExactContents(program.allow)
    );
    expect(settings.policy.deny.licenses).toEqual(
      jasmine.arrayWithExactContents(program.deny)
    );
    expect(settings.verbose).toBe(program.verbose);
  });

  it('maps all settings from file', () => {
    const settingsFilePath = './test/fixtures/abogado_test.json';

    const settings = settingsProvider.getSettings(settingsFilePath);

    const fileSettings = JSON.parse(
      fs.readFileSync(settingsFilePath).toString()
    );

    expect(settings.outputPath).toBe(fileSettings.outputPath);
    expect(settings.policy.allow.licenses).toEqual(
      jasmine.arrayWithExactContents(fileSettings.policy.allow.licenses)
    );
    expect(settings.policy.deny.licenses).toEqual(
      jasmine.arrayWithExactContents(fileSettings.policy.deny.licenses)
    );
    expect(settings.verbose).toBe(fileSettings.verbose);
  });

  it('overrides file settings with command-line parameters when present', () => {
    program.outputPath = 'path/to/thing';

    const settingsFilePath = './test/fixtures/abogado_test.json';

    const settings = settingsProvider.getSettings(settingsFilePath);

    const fileSettings = JSON.parse(
      fs.readFileSync(settingsFilePath).toString()
    );

    expect(settings.outputPath).toBe(program.outputPath);
  });
});
