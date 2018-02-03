import * as _ from 'lodash';

import { Dependency } from './dependency';
import { Package } from './package';
import { Policy } from './policy';
import { PolicyList } from './policy-list';
import { Violation } from './violation';

export function evaluate(pkg: Package, policy: Policy): Violation[] {
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

function evaluateBlacklistPolicy(
  pkg: Package,
  blacklist: PolicyList
): Violation[] {
  const violators = _.filter(pkg.dependencies, (dependency: Dependency) => {
    return _.some(blacklist.licenses, (licensePattern: string) =>
      new RegExp(licensePattern).test(dependency.license)
    );
  });

  const violations = _.map(violators, (dependency: Dependency) => {
    return {
      dependencyName: dependency.name,
      reason:
        "License '" +
        dependency.license +
        "' is explicitly prohibited by policy."
    };
  });

  return violations;
}

function evaluateWhitelistPolicy(
  pkg: Package,
  whitelist: PolicyList
): Violation[] {
  const violators = _.filter(pkg.dependencies, (dependency: Dependency) => {
    return !_.some(whitelist.licenses, (licensePattern: string) =>
      new RegExp(licensePattern).test(dependency.license)
    );
  });

  const violations = _.map(violators, (dependency: Dependency) => {
    return {
      dependencyName: dependency.name,
      reason:
        "License '" +
        dependency.license +
        "' is not explicitly permitted by policy."
    };
  });

  return violations;
}
