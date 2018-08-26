const fs = require('fs');
const jsonFile = require('jsonfile');
const path = require('path');

function buildPackage(packageDir, packageLock, logger) {
  const dependenciesDir = path.join(packageDir, 'node_modules');
  const pkg = {
    dependencies: Object.keys(packageLock.dependencies).map(k =>
      buildDependency(k, dependenciesDir, logger)
    )
  };

  return pkg;
}

function buildDependency(name, dependenciesDir, logger) {
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

  return dependency;
}

function getLicenseText(license) {
  if (typeof license === 'object') {
    return license.type;
  }

  return String(license);
}

module.exports = buildPackage;
