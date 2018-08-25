const jsonFile = require('jsonfile');

const buildPackage = require('../src/build-package');

describe('build-package', () => {
  const logger = {
    warn: () => {}
  };

  it('processes dependencies defined in package.json but not installed', () => {
    const packageDir = '.';
    const packageLock = {
      dependencies: {
        foo: {}
      }
    };

    const pkg = buildPackage(packageDir, packageLock, logger);

    const actualDependency = pkg.dependencies.find(d => d.name === 'foo');

    expect(actualDependency).toBeTruthy();

    expect(actualDependency.description).toBeFalsy();
    expect(actualDependency.license).toBeFalsy();
    expect(actualDependency.name).toBe('foo');
    expect(actualDependency.version).toBeFalsy();
  });

  it('processes dependencies defined in package.json and installed', () => {
    const packageDir = '.';
    const packageLock = {
      dependencies: {
        jasmine: {}
      }
    };

    const pkg = buildPackage(packageDir, packageLock, logger);

    const expectedDependency = jsonFile.readFileSync(
      './node_modules/jasmine/package.json'
    );
    const actualDependency = pkg.dependencies.find(
      d => d.name === Object.keys(packageLock.dependencies)[0]
    );

    expect(actualDependency).toBeTruthy();

    expect(actualDependency.description).toBe(expectedDependency.description);
    expect(actualDependency.license).toBe(expectedDependency.license);
    expect(actualDependency.name).toBe(expectedDependency.name);
    expect(actualDependency.version).toBe(expectedDependency.version);
  });
});
