import * as _ from 'lodash';

import { Dependency } from './dependency.class';
import { Package } from './package.class';
import { Policy } from './policy.class';
import { Violation } from './violation.class';

export function evaluate(pkg: Package, allow: string[], deny: string[]): Violation[] {
  // skip evaluation if no policy is specified
  if (!allow && !deny) {
    return undefined;
  }

  if (allow && allow.length > 0) {
    return evaluateWhitelistPolicy(pkg, allow);
  } else if (deny && deny.length > 0) {
    return evaluateBlacklistPolicy(pkg, deny);
  }
}

function evaluateBlacklistPolicy(pkg: Package, blacklist: string[]): Violation[] {
  const violators = _.filter(pkg.dependencies, (dependency: Dependency) => {
    return _.some(blacklist, (licensePattern: string) => new RegExp(licensePattern).test(dependency.license));
  });

  const violations = _.map(violators, (dependency: Dependency) => {
    return {
      dependencyName: dependency.name,
      reason: 'License \'' + dependency.license + '\' is explicitly prohibited by policy.'
    };
  });

  return violations;
}

function evaluateWhitelistPolicy(pkg: Package, whitelist: string[]): Violation[] {
  const violators = _.filter(pkg.dependencies, (dependency: Dependency) => {
    return !_.some(whitelist, (licensePattern: string) => new RegExp(licensePattern).test(dependency.license));
  });

  const violations = _.map(violators, (dependency: Dependency) => {
    return {
      dependencyName: dependency.name,
      reason: 'License \'' + dependency.license + '\' is not explicitly permitted by policy.'
    };
  });

  return violations;
}
