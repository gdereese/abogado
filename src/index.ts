import * as program from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import * as packageBuilder from './package-builder';
import * as paralegal from './paralegal';
import * as reportBuilder from './report-builder';
import { Settings } from './settings.class';
import { Violation } from './violation.class';

program
  .arguments('<package-dir>')
  .usage('<package-dir> [options]')
  .option('-a, --allow <licenses>', 'List of licenses to allow', ['*'])
  .option('-d, --deny <licenses>', 'List of licenses to deny', [])
  .option('-o, --output-path <path>', 'Path to report output file')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(main)
  .parse(process.argv);

// if we get here, the required param(s) weren't supplied;
// display help info and bail out
console.log();
console.error('*** ERROR: package directory not specified\n');
program.help();
program.exit(2);

function main(packageDir: string) {
  console.log();

  writeVerbose('Collecting dependencies...');
  const packageLockPath = path.join(packageDir, 'package-lock.json');
  const dependenciesDir = path.join(packageDir, 'node_modules');
  const pkg = packageBuilder.build(packageLockPath, dependenciesDir);
  writeVerbose('done.\n');

  let violations: Violation[];
  if (program.allow || program.deny) {
    writeVerbose('Evaluating dependencies for policy violations...');
    violations = paralegal.evaluate(pkg, program.allow, program.deny);
    writeVerbose('done.\n');

    if (violations) {
      _.forEach(violations, (violation: Violation) => {
        console.error('*** VIOLATION (' + violation.dependencyName + '): ' + violation.reason);
      });
    } else {
      console.log('No policy violations found.');
    }
  }

  if (program.outputPath) {
    writeVerbose('Generating report...');
    const report = reportBuilder.build(pkg, program, violations);
    writeVerbose('done.\n');

    fs.writeFileSync(program.outputPath, report);
    writeVerbose('Report written to ' + path.resolve(program.outputPath) + '.\n');
  }

  console.log();
  if ((program.allow || program.deny) && violations) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function writeVerbose(text: string) {
  if (program.verbose) {
    console.log(text);
  }
}