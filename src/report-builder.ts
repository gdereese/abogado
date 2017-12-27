import * as _ from 'lodash';

import { Package } from './package.class';
import { Report } from './report.class';
import { Settings } from './settings.class';
import { Violation } from './violation.class';

export function build(pkg: Package, settings: Settings, violations: Violation[]): Report {
  return {
    dependenciesByLicense: _.groupBy(pkg.dependencies, 'license'),
    generated: new Date(),
    policy: settings.policy,
    violations: violations
  };
}
