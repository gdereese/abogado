import * as program from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import * as logger from './logger';
import * as packageBuilder from './package-builder';
import * as paralegal from './paralegal';
import * as reportBuilder from './report-builder';
import * as validator from './validator';
import { Violation } from './violation.class';

export function run(packageDir: string) {
  const validationErrors = validator.validate(program);
  if (validationErrors.length > 0) {
    _.forEach(validationErrors, (error: string) => {
      logger.error('*** ERROR: ' + error);
    });
    process.exit(2);
  }

  logger.info('Processing started.');

  logger.verbose('Collecting dependencies...');
  const packageLockPath = path.join(packageDir, 'package-lock.json');
  const dependenciesDir = path.join(packageDir, 'node_modules');
  const pkg = packageBuilder.build(packageLockPath, dependenciesDir);

  let violations: Violation[];
  if (program.allow || program.deny) {
    logger.verbose('Evaluating dependencies for policy violations...');
    violations = paralegal.evaluate(pkg, program.allow, program.deny);

    if ((violations || []).length > 0) {
      _.forEach(violations, (violation: Violation) => {
        logger.error('*** VIOLATION (' + violation.dependencyName + '): ' + violation.reason);
      });
    } else {
      logger.info('No policy violations found.');
    }
  }

  if (program.outputPath) {
    logger.verbose('Generating report...');
    const report = reportBuilder.build(pkg, program, violations);
    fs.writeFileSync(program.outputPath, report);
    logger.verbose('Report written to ' + path.resolve(program.outputPath) + '.');
  }

  logger.info('Processing complete.');

  if ((violations || []).length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
