const _ = require('lodash');

const paralegal = {
  evaluate(pkg, policy) {
    // skip evaluation if no policy is specified
    if (!policy || (!policy.allow && !policy.deny)) {
      return undefined;
    }

    if (policy.allow && policy.allow.licenses.length > 0) {
      return evaluateWhitelistPolicy(pkg, policy.allow);
    } else if (policy.deny && policy.deny.licenses.length > 0) {
      return evaluateBlacklistPolicy(pkg, policy.deny);
    }
  }
};

function evaluateBlacklistPolicy(pkg, blacklist) {
  const violators = _.filter(pkg.dependencies, dependency => {
    return _.some(blacklist.licenses, licensePattern =>
      new RegExp(licensePattern).test(dependency.license)
    );
  });

  const violations = _.map(violators, dependency => {
    return {
      dependencyName: dependency.name,
      reason: `License '${
        dependency.license
      }' is explicitly prohibited by policy.`
    };
  });

  return violations;
}

function evaluateWhitelistPolicy(pkg, whitelist) {
  const violators = _.filter(pkg.dependencies, dependency => {
    return !_.some(whitelist.licenses, licensePattern =>
      new RegExp(licensePattern).test(dependency.license)
    );
  });

  const violations = _.map(violators, dependency => {
    return {
      dependencyName: dependency.name,
      reason: `License '${
        dependency.license
      }' is not explicitly permitted by policy.`
    };
  });

  return violations;
}

module.exports = paralegal;
