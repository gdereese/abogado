const fs = require('fs');
const jsonFile = require('jsonfile');
const path = require('path');

const logger = require('./logger');

const packageBuilder = {
  build(packageDir, packageLock) {
    const pkg = {
      dependencies: []
    };

    const dependenciesDir = path.join(packageDir, 'node_modules');
    for (const name of Object.keys(packageLock.dependencies)) {
      addDependency(name, dependenciesDir, pkg.dependencies);
    }

    return pkg;
  }
};

function addDependency(name, dependenciesDir, dependencies) {
  const dependency = {
    name
  };

  const dependencyPackageJsonPath = path.join(
    dependenciesDir,
    name,
    'package.json'
  );
  if (fs.existsSync(dependencyPackageJsonPath)) {
    dependency.path = dependencyPackageJsonPath;

    const dependencyPackage = jsonFile.readFileSync(dependencyPackageJsonPath);
    dependency.description = dependencyPackage.description;
    dependency.license = getLicenseText(dependencyPackage.license);
    dependency.version = dependencyPackage.version;
  } else {
    logger.warn(`WARN: Files for dependency '${name}' were not found.`);
  }

  dependencies.push(dependency);
}

function getLicenseText(license) {
  if (typeof license === 'object') {
    return license.type;
  }

  return String(license);
}

module.exports = packageBuilder;
