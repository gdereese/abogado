import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import { Dependency } from './dependency.class';
import { Package } from './package.class';

function addDependency(name: string, dependenciesDir: string, dependencies: Dependency[]) {
  const dependencyPackageJsonPath = path.join(dependenciesDir, name, 'package.json');
  const dependencyPackage = JSON.parse(fs.readFileSync(dependencyPackageJsonPath).toString());

  const dependency = {
    description: dependencyPackage.description,
    license: dependencyPackage.license,
    name: dependencyPackage.name,
    version: dependencyPackage.version
  };
  const dependencyExists = (d: Dependency) => {
    return d.name === dependency.name && d.version === d.version;
  };
  if (!_.some(dependencies, dependencyExists)) {
    dependencies.push(dependency);
  }
}

export function build(packageLockPath: string, dependenciesDir: string): Package {
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath).toString());

  const pkg = {
    dependencies: new Array<Dependency>()
  };

  const dependencyNames = _.keys(packageLock.dependencies);
  _.forEach(dependencyNames, (name: string) => addDependency(name, dependenciesDir, pkg.dependencies));

  return pkg;
}
