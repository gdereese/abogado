const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const packageBuilder = {
  build(packageDir) {
    const packageLockPath = path.join(packageDir, 'package-lock.json');
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath).toString());

    const pkg = {
      dependencies: []
    };

    const dependenciesDir = path.join(packageDir, 'node_modules');
    const dependencyNames = _.keys(packageLock.dependencies);
    _.forEach(dependencyNames, name =>
      addDependency(name, dependenciesDir, pkg.dependencies)
    );

    return pkg;
  }
};

function addDependency(name, dependenciesDir, dependencies) {
  const dependencyPackageJsonPath = path.join(
    dependenciesDir,
    name,
    'package.json'
  );
  const dependencyPackage = JSON.parse(
    fs.readFileSync(dependencyPackageJsonPath).toString()
  );

  const dependency = {
    description: dependencyPackage.description,
    license: getLicenseText(dependencyPackage.license),
    name: dependencyPackage.name,
    version: dependencyPackage.version
  };
  const dependencyExists = d => {
    return d.name === dependency.name && d.version === dependency.version;
  };
  if (!_.some(dependencies, dependencyExists)) {
    dependencies.push(dependency);
  }
}

function getLicenseText(license) {
  if (typeof license === 'object') {
    return license.type;
  }

  return String(license);
}

module.exports = packageBuilder;
