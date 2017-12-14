import * as _ from 'lodash';

import { Package } from './package.class';
import { Report } from './report.class';
import { Violation } from './violation.class';

export function build(pkg: Package, policy: any, violations: Violation[]): Report {
  return {
    dependenciesByLicense: _.groupBy(pkg.dependencies, 'license'),
    generated: new Date(),
    policy: policy,
    violations: violations
  };
}
