#!/usr/bin/env node

import * as program from 'commander';

import * as logger from './logger';
import * as processor from './processor';

program
  .option(
    '-p, --package-dir <path>',
    'Directory of package to audit (must contain package-lock.json)',
    '.'
  )
  .option(
    '-a, --allow <licenses>',
    'List of licenses to allow (supports RegEx patterns)',
    split
  )
  .option(
    '-d, --deny <licenses>',
    'List of licenses to deny (supports Regex patterns)',
    split
  )
  .option('-o, --output-path <path>', 'Path to report output file')
  .option('-v, --verbose', 'Enable verbose logging')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

processor.run();

function split(val: string): string[] {
  return val.split(',');
}
