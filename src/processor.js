const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const logger = require('./logger');
const paralegal = require('./paralegal');
const reportBuilder = require('./report-builder');

const processor = {
  run(settings) {
    logger.info('Processing started.');

    let violations;
    if (settings.policy && (settings.policy.allow || settings.policy.deny)) {
      logger.verbose('Evaluating dependencies for policy violations...');
      violations = paralegal.evaluate(settings.package, settings.policy);

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
  }
};

module.exports = processor;
