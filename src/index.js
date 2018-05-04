#!/usr/bin/env node

const fs = require('fs');
const jsonFile = require('jsonfile');
const path = require('path');
const program = require('commander');

const law = require('./law');
const logger = require('./logger');
const packageBuilder = require('./package-builder');
const paralegal = require('./paralegal');
const reportBuilder = require('./report-builder');
const settingsProvider = require('./settings-provider');
const validator = require('./validator');

const split = value => value.split(',');

program
  .option(
    '--allow-licenses <licenses>',
    'List of licenses to allow (supports RegEx patterns)',
    split
  )
  .option(
    '--allow-packages <packages>',
    'List of packages to allow (supports RegEx patterns)',
    split
  )
  .option(
    '--deny-licenses <licenses>',
    'List of licenses to deny (supports RegEx patterns)',
    split
  )
  .option(
    '--deny-packages <packages>',
    'List of packages to deny (supports RegEx patterns)',
    split
  )
  .option(
    '-p, --package-dir <path>',
    'Directory of package to audit (must contain package-lock.json)',
    '.'
  )
  .option('-o, --output-path <path>', 'Path to report output file')
  .option('-v, --verbose', 'Enable verbose logging')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

// combine file and command-line settings with defaults
const settingsFilePath = path.resolve(program.packageDir, 'abogado.json');
const settings = settingsProvider.getSettings(settingsFilePath, program);

logger.initialize(settings);

logger.info('');

// build package representation from package-lock.json
logger.verbose(
  `Collecting dependencies from package '${program.packageDir}'...`
);
const packageLockPath = path.join(program.packageDir, 'package-lock.json');
const packageLock = jsonFile.readFileSync(packageLockPath);
settings.package = packageBuilder.build(program.packageDir, packageLock);

// validate settings (abort if any issue found)
const validationErrors = validator.validate(settings);
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
  const report = reportBuilder.build(settings, violations);

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
