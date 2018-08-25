const _ = require('lodash');

function buildReport(pkg, settings, violations) {
  return {
    dependenciesByLicense: _.groupBy(settings.package.dependencies, 'license'),
    generated: new Date(),
    policy: settings.policy,
    violations
  };
}

module.exports = buildReport;
