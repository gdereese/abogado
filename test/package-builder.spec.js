const jsonFile = require('jsonfile');
const _ = require('lodash');

const mockConsole = require('./fixtures/mock-console');
const packageBuilder = require('../src/package-builder');

describe('package-builder', () => {
  beforeAll(() => {
    mockConsole.start();
  });

  afterAll(() => {
    mockConsole.stop();
  });

  it('processes dependencies defined in package.json but not installed', () => {
    const packageDir = '.';
    const packageLock = {
      dependencies: {
        foo: {}
      }
    };

    const pkg = packageBuilder.build(packageDir, packageLock);

    const actualDependency = _.find(pkg.dependencies, { name: 'foo' });

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

    const pkg = packageBuilder.build(packageDir, packageLock);

    const expectedDependency = jsonFile.readFileSync(
      './node_modules/jasmine/package.json'
    );
    const actualDependency = _.find(pkg.dependencies, {
      name: _.keys(packageLock.dependencies)[0]
    });

    expect(actualDependency).toBeTruthy();

    expect(actualDependency.description).toBe(expectedDependency.description);
    expect(actualDependency.license).toBe(expectedDependency.license);
    expect(actualDependency.name).toBe(expectedDependency.name);
    expect(actualDependency.version).toBe(expectedDependency.version);
  });
});
