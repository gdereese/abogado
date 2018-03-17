import * as program from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import * as logger from './logger';
import * as packageBuilder from './package-builder';
import * as paralegal from './paralegal';
import * as reportBuilder from './report-builder';
import * as settingsProvider from './settings-provider';
import * as validator from './validator';
import { Violation } from './violation';

export function run() {
  logger.info('');

  const validationErrors = validator.validate(program);
  if (validationErrors.length > 0) {
    _.forEach(validationErrors, (error: string) => {
      logger.error('*** ERROR: ' + error);
    });
    process.exit(2);
  }

  logger.verbose(
    "Auditing package in directory '" + path.resolve(program.packageDir) + "'."
  );

  // look for settings file in specified package dir,
  // fallback to current directory if not specified
  const settingsFilePath = path.resolve(program.packageDir, 'abogado.json');
  const settings = settingsProvider.getSettings(settingsFilePath);

  logger.info('Processing started.');

  logger.verbose('Collecting dependencies...');
  const pkg = packageBuilder.build(program.packageDir);

  let violations: Violation[];
  if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
    logger.verbose('Evaluating dependencies for policy violations...');
    violations = paralegal.evaluate(pkg, settings.policy);

    if ((violations || []).length > 0) {
      _.forEach(violations, (violation: Violation) => {
        logger.error(
          '*** VIOLATION (' +
            violation.dependencyName +
            '): ' +
            violation.reason
        );
      });
    } else {
      logger.info('No policy violations found.');
    }
  } else {
    logger.info('No policy specified.');
  }

  if (settings.outputPath) {
    logger.verbose('Generating report...');
    const report = reportBuilder.build(pkg, settings, violations);
    fs.writeFileSync(settings.outputPath, report);
    logger.verbose(
      'Report written to ' + path.resolve(settings.outputPath) + '.'
    );
  }

  logger.info('Processing complete.');
  if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
    logger.info(
      pkg.dependencies.length +
        ' packages audited, ' +
        (violations || []).length +
        ' violations found.'
    );
  }

  logger.info('');
  if ((violations || []).length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
