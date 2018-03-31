const program = require('commander');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const logger = require('./logger');
const packageBuilder = require('./package-builder');
const paralegal = require('./paralegal');
const reportBuilder = require('./report-builder');
const validator = require('./validator');

const processor = {
  run(settings) {
    logger.info('');

    const validationErrors = validator.validate(program);
    if (validationErrors.length > 0) {
      _.forEach(validationErrors, error => {
        logger.error(`*** ERROR: '${error}`);
      });
      return 2;
    }

    logger.verbose(
      `Auditing package in directory '${path.resolve(program.packageDir)}'.`
    );

    logger.info('Processing started.');

    logger.verbose('Collecting dependencies...');
    const pkg = packageBuilder.build(program.packageDir);

    let violations;
    if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
      logger.verbose('Evaluating dependencies for policy violations...');
      violations = paralegal.evaluate(pkg, settings.policy);

      if ((violations || []).length > 0) {
        _.forEach(violations, violation => {
          logger.error(
            `*** VIOLATION (${violation.dependencyName}): ${violation.reason}`
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
      logger.verbose(`Report written to ${path.resolve(settings.outputPath)}.`);
    }

    logger.info('Processing complete.');
    if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
      logger.info(
        `${pkg.dependencies.length} packages audited, ${
          (violations || []).length
        } violations found.`
      );
    }

    logger.info('');
    if ((violations || []).length > 0) {
      return 1;
    }

    return 0;
  }
};

module.exports = processor;
