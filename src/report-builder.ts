import * as _ from 'lodash';

import { Package } from './package';
import { Report } from './report';
import { Settings } from './settings';
import { Violation } from './violation';

export function build(
  pkg: Package,
  settings: Settings,
  violations: Violation[]
): Report {
  return {
    dependenciesByLicense: _.groupBy(pkg.dependencies, 'license'),
    generated: new Date(),
    policy: settings.policy,
    violations
  };
}
