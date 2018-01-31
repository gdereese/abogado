import * as paralegal from '../src/paralegal';

describe('paralegal', () => {
  it('detects no violation for license specified in whitelist', () => {
    const pkg = {
      dependencies: [
        {
          description: '',
          license: 'foo',
          name: '',
          version: ''
        }
      ]
    };
    const policy = {
      allow: {
        licenses: ['foo']
      },
      deny: {
        licenses: new Array<string>()
      }
    };

    const violations = paralegal.evaluate(pkg, policy);

    expect(violations.length).toBe(0);
  });

  it('detects no violation for license not specified in blacklist', () => {
    const pkg = {
      dependencies: [
        {
          description: '',
          license: 'foo',
          name: '',
          version: ''
        }
      ]
    };
    const policy = {
      allow: {
        licenses: new Array<string>()
      },
      deny: {
        licenses: ['bar']
      }
    };

    const violations = paralegal.evaluate(pkg, policy);

    expect(violations.length).toBe(0);
  });

  it('detects violation for license not specified in whitelist', () => {
    const pkg = {
      dependencies: [
        {
          description: '',
          license: 'foo',
          name: '',
          version: ''
        }
      ]
    };
    const policy = {
      allow: {
        licenses: ['bar']
      },
      deny: {
        licenses: new Array<string>()
      }
    };

    const violations = paralegal.evaluate(pkg, policy);

    expect(violations.length).toBe(1);
  });

  it('detects violation for license specified in blacklist', () => {
    const pkg = {
      dependencies: [
        {
          description: '',
          license: 'foo',
          name: '',
          version: ''
        }
      ]
    };
    const policy = {
      allow: {
        licenses: new Array<string>()
      },
      deny: {
        licenses: ['foo']
      }
    };

    const violations = paralegal.evaluate(pkg, policy);

    expect(violations.length).toBe(1);
  });
});
