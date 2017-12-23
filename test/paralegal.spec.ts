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
    const allow = ['foo'];
    const deny = new Array<string>();

    const violations = paralegal.evaluate(pkg, allow, deny);

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
    const allow = new Array<string>();
    const deny = ['bar'];

    const violations = paralegal.evaluate(pkg, allow, deny);

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
    const allow = ['bar'];
    const deny = new Array<string>();

    const violations = paralegal.evaluate(pkg, allow, deny);

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
    const allow = new Array<string>();
    const deny = ['foo'];

    const violations = paralegal.evaluate(pkg, allow, deny);

    expect(violations.length).toBe(1);
  });
});