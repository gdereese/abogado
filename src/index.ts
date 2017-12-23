#!/usr/bin/env node

import * as program from 'commander';

import * as logger from './logger';
import * as processor from './processor';

program
  .arguments('<package-dir>')
  .usage('<package-dir> [options]')
  .option('-a, --allow <licenses>', 'List of licenses to allow (supports RegEx patterns)', split)
  .option('-d, --deny <licenses>', 'List of licenses to deny (supports Regex patterns)', split)
  .option('-o, --output-path <path>', 'Path to report output file')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(processor.run)
  .parse(process.argv);

// if we get here, the required param(s) weren't supplied;
// display help info and bail out
logger.error('*** ERROR: package directory not specified');
program.help();
process.exit(2);

function split(val: string): string[] {
  return val.split(',');
}