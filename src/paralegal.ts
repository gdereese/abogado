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

  if (allow) {
    return evaluatePermitPolicy(pkg, allow);
  } else if (deny) {
    return evaluateProhibitPolicy(pkg, deny);
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