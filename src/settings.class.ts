import { Policy } from './policy.class';

export class Settings {
  constructor() {
    this.packageDir = '.';
  }

  public packageDir: string;
  public policy: Policy;
  public reportPath: string;
}
