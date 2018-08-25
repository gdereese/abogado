#!/usr/bin/env node

const fs = require('fs');
const jsonFile = require('jsonfile');
const path = require('path');
const program = require('commander');

const buildReport = require('./build-report');
const getSettings = require('./get-settings');
const law = require('./law');
const logger = require('./logger');
const packageBuilder = require('./package-builder');
const paralegal = require('./paralegal');
const parseArgs = require('./parse-args');
const validateSettings = require('./validate-settings');

program.on('--help', () => {
  console.log();
});

const args = parseArgs({
  program
});

// combine file and command-line settings with defaults
const settingsFilePath = path.resolve(args.packageDir, 'abogado.json');
const settings = getSettings(settingsFilePath, args);

logger.initialize(settings);

logger.info('');

// build package representation from package-lock.json
logger.verbose(`Collecting dependencies from package '${args.packageDir}'...`);
const packageLockPath = path.join(args.packageDir, 'package-lock.json');
const packageLock = jsonFile.readFileSync(packageLockPath);
settings.package = packageBuilder.build(args.packageDir, packageLock);

// validate settings (abort if any issue found)
const validationErrors = validateSettings(settings);
for (const error of validationErrors) {
  logger.error(`*** ERROR: '${error}`);
}
if (validationErrors && validationErrors.length > 0) {
  throw new Error('One or more validation errors were encountered.');
}
logger.verbose('Settings validated.');

logger.info('Processing started.');

// process package against policy
let violations;
if (settings.policy) {
  logger.verbose('Evaluating dependencies for policy violations...');
  violations = paralegal.evaluate(settings.package, settings.policy, law);

  if (violations && violations.length > 0) {
    for (const violation of violations) {
      logger.error(
        `*** VIOLATION (${violation.dependencyName}): ${violation.reason}`
      );
    }
  } else {
    logger.info('No policy violations found.');
  }
} else {
  logger.info('No policy specified.');
}

// build report
if (settings.outputPath) {
  logger.verbose('Generating report...');
  const report = buildReport(settings, violations);

  fs.writeFileSync(settings.outputPath, report);
  logger.verbose(`Report written to ${path.resolve(settings.outputPath)}.`);
}

logger.info('Processing complete.');
if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
  logger.info(
    `${settings.package.dependencies.length} packages audited, ${
      (violations || []).length
    } violations found.`
  );
}

logger.info('');
