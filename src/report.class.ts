import { Dictionary } from 'lodash';

import { Dependency } from './dependency.class';
import { Policy } from './policy.class';
import { Violation } from './violation.class';

export class Report {
  public dependenciesByLicense: Dictionary<Dependency[]>;
  public generated: Date;
  public policy: Policy;
  public violations: Violation[];
}
