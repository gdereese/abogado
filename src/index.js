#!/usr/bin/env node

const _ = require('lodash');
const path = require('path');
const program = require('commander');

const logger = require('./logger');
const packageBuilder = require('./package-builder');
const processor = require('./processor');
const settingsProvider = require('./settings-provider');
const validator = require('./validator');

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

const settingsFilePath = path.resolve(program.packageDir, 'abogado.json');
const settings = settingsProvider.getSettings(settingsFilePath, program);

logger.initialize(settings);

logger.info('');

logger.verbose(
  `Collecting dependencies from package '${program.packageDir}'...`
);
settings.package = packageBuilder.build(program.packageDir);

const validationErrors = validator.validate(settings);
if (validationErrors.length > 0) {
  _.forEach(validationErrors, error => {
    logger.error(`*** ERROR: '${error}`);
  });
  throw new Error('One or more validation errors were encountered.');
}

processor.run(settings);

logger.info('');

function split(val) {
  return val.split(',');
}
