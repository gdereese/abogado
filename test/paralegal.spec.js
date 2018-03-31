const paralegal = require('../src/paralegal');

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
        licenses: []
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
        licenses: []
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
        licenses: []
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
        licenses: []
      },
      deny: {
        licenses: ['foo']
      }
    };

    const violations = paralegal.evaluate(pkg, policy);

    expect(violations.length).toBe(1);
  });
});
