import { Dictionary } from 'lodash';

import { Dependency } from './dependency';
import { Policy } from './policy';
import { Violation } from './violation';

export class Report {
  public dependenciesByLicense: Dictionary<Dependency[]>;
  public generated: Date;
  public policy: Policy;
  public violations: Violation[];
}
