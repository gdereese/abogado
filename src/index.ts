import * as program from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import * as packageBuilder from './package-builder';
import * as paralegal from './paralegal';
import * as reportBuilder from './report-builder';
import { Settings } from './settings.class';
import { Violation } from './violation.class';

// TODO: support allow/deny of specific packages

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
process.stdout.write('\n');
process.stderr.write('*** ERROR: package directory not specified\n');
program.help();
process.stdout.write('\n');
program.exit(2);

function main(packageDir: string) {
  const settings = new Settings();

  process.stdout.write('\n');

  writeVerbose('Collecting dependencies...');
  const packageLockPath = path.join(settings.packageDir, 'package-lock.json');
  const dependenciesDir = path.join(settings.packageDir, 'node_modules');
  const pkg = packageBuilder.build(packageLockPath, dependenciesDir);
  writeVerbose('done.\n');

  let violations: Violation[];
  if (settings.policy) {
    writeVerbose('Evaluating dependencies for policy violations...');
    violations = paralegal.evaluate(pkg, settings.policy);
    writeVerbose('done.\n');

    if (violations) {
      _.forEach(violations, (violation: Violation) => {
        process.stderr.write('*** VIOLATION (' + violation.dependencyName + '): ' + violation.reason + '\n');
      });
    } else {
      process.stdout.write('No policy violations found.\n');
    }
  }

  if (settings.reportPath) {
    writeVerbose('Generating report...');
    const report = reportBuilder.build(pkg, settings.policy, violations);
    writeVerbose('done.\n');

    fs.writeFileSync(settings.reportPath, report);
    writeVerbose('Report written to ' + path.resolve(settings.reportPath) + '.\n');
  }

  process.stdout.write('\n');
  if (settings.policy && violations) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function writeVerbose(text: string) {
  if (program.verbose) {
    process.stdout.write(text);
  }
}