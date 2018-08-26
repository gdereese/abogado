const evaluateLaw = require('../src/evaluate-law');

describe('paralegal', () => {
  let pkg = null;
  let policy = null;

  beforeAll(() => {
    pkg = {
      dependencies: [
        {
          description: '',
          license: '',
          name: 'foo',
          version: ''
        }
      ]
    };
    policy = {};
  });

  it('detects violation for a broken deny rule', () => {
    const law = [
      {
        name: 'must-not-be-foo',
        isViolationIfMatch: true,
        match: dependency => dependency.name === 'foo'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(1);

    expect(violations[0].reason).toBe(law[0].name);
  });

  it('detects no violation for an unbroken deny rule', () => {
    const law = [
      {
        name: 'must-be-foo',
        isViolationIfMatch: true,
        match: dependency => dependency.name !== 'foo'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(0);
  });

  it('detects no violation for a broken allow rule', () => {
    const law = [
      {
        name: 'can-be-bar',
        isViolationIfMatch: false,
        match: dependency => dependency.name === 'bar'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(0);
  });

  it('detects no violation for an unbroken allow rule', () => {
    const law = [
      {
        name: 'can-be-foo',
        isViolationIfMatch: false,
        match: dependency => dependency.name === 'foo'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(0);
  });

  it('detects violation for precedent broken deny rule', () => {
    const law = [
      {
        name: 'must-not-be-foo',
        isViolationIfMatch: true,
        match: dependency => dependency.name === 'foo'
      },
      {
        name: 'can-be-foo',
        isViolationIfMatch: false,
        match: dependency => dependency.name === 'foo'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(1);

    expect(violations[0].reason).toBe(law[0].name);
  });

  it('detects violation for antecendent broken deny rule', () => {
    const law = [
      {
        name: 'can-be-foo',
        isViolationIfMatch: false,
        match: dependency => dependency.name === 'foo'
      },
      {
        name: 'must-not-be-foo',
        isViolationIfMatch: true,
        match: dependency => dependency.name === 'foo'
      }
    ];

    const violations = evaluateLaw(pkg, policy, law);

    expect(violations.length).toBe(1);

    expect(violations[0].reason).toBe(law[1].name);
  });
});
