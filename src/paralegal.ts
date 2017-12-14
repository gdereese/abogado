import * as _ from 'lodash';

import { Dependency } from './dependency.class';
import { Package } from './package.class';
import { Policy } from './policy.class';
import { Violation } from './violation.class';

// TODO: perhaps reference https://github.com/sindresorhus/spdx-license-list and look for special token strings for groups of licenses:
// (spdx = all registered, osi = osi approved)

export function evaluate(pkg: Package, policy: Policy): Violation[] {
  if (!policy) {
    return undefined;
  }

  if (policy.type.toUpperCase() === 'PERMIT') {
    return evaluatePermitPolicy(pkg, policy.licenses);
  } else if (policy.type.toUpperCase() === 'PROHIBIT') {
    return evaluateProhibitPolicy(pkg, policy.licenses);
  } else if (!policy.type) {
    throw new Error('Unspecified policy type');
  } else {
    throw new Error('Invalid policy type \'' + policy.type + '\'');
  }
}

function evaluatePermitPolicy(pkg: Package, permittedLicenses: string[]): Violation[] {
  const violations = new Array<Violation>();

  _.forEach(pkg.dependencies, (dependency: Dependency) => {
    if (!_.some(permittedLicenses, (license: string) => new RegExp(license).test(dependency.license))) {
      violations.push({
        dependencyName: dependency.name,
        reason: 'License \'' + dependency.license + '\' is not explicitly permitted by policy.'
      });
    }
  });

  return violations;
}

function evaluateProhibitPolicy(pkg: Package, prohibitedLicenses: string[]): Violation[] {
  const violations = new Array<Violation>();

  _.forEach(pkg.dependencies, (dependency: Dependency) => {
    if (_.some(prohibitedLicenses, (license: string) => new RegExp(license).test(dependency.license))) {
      violations.push({
        dependencyName: dependency.name,
        reason: 'License \'' + dependency.license + '\' is explicitly prohibited by policy.'
      });
    }
  });

  return violations;
}