const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const packageBuilder = require('../src/package-builder');

describe('package-builder', () => {
  it('reads dependency name and version from package-lock.json', () => {
    const packageDir = '.';

    const pkg = packageBuilder.build('.');

    const packageLockPath = path.join(packageDir, 'package-lock.json');
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath).toString());

    expect(pkg).toBeTruthy();

    expect(pkg.dependencies).toBeTruthy();

    for (const name of _.keys(packageLock.dependencies)) {
      const packageLockDependency = packageLock.dependencies[name];

      const packageDependency = _.find(pkg.dependencies, {
        name
      });

      expect(packageDependency.version).toBe(packageLockDependency.version);
    }
  });
});
