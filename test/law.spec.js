const law = require('../src/law');

describe('law', () => {
  describe('explicit-allow', () => {
    let rule = null;

    beforeAll(() => {
      rule = law.find(r => r.name === 'explicit-allow');
    });

    it('matches for dependency in package whitelist', () => {
      const dependency = {
        name: 'foo'
      };
      const policy = {
        allow: {
          packages: ['foo']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(true);
    });

    it('does not match for dependency not in package whitelist', () => {
      const dependency = {
        name: 'foo'
      };
      const policy = {
        allow: {
          packages: ['bar']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(false);
    });
  });

  describe('explicit-deny', () => {
    let rule = null;

    beforeAll(() => {
      rule = law.find(r => r.name === 'explicit-deny');
    });

    it('matches for dependency in package blacklist', () => {
      const dependency = {
        name: 'foo'
      };
      const policy = {
        deny: {
          packages: ['foo']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(true);
    });

    it('does not match for dependency not in package blacklist', () => {
      const dependency = {
        name: 'foo'
      };
      const policy = {
        deny: {
          packages: ['bar']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(false);
    });
  });

  describe('inherited-allow', () => {
    let rule = null;

    beforeAll(() => {
      rule = law.find(r => r.name === 'inherited-allow');
    });

    it('matches for dependency in license whitelist', () => {
      const dependency = {
        license: 'foo'
      };
      const policy = {
        allow: {
          licenses: ['foo']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(true);
    });

    it('matches for no policy', () => {
      const dependency = {
        license: 'foo'
      };
      const policy = {};

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(true);
    });

    it('does not match for dependency not in license whitelist', () => {
      const dependency = {
        license: 'foo'
      };
      const policy = {
        allow: {
          licenses: ['bar']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(false);
    });
  });

  describe('inherited-deny', () => {
    let rule = null;

    beforeAll(() => {
      rule = law.find(r => r.name === 'inherited-deny');
    });

    it('matches for dependency in license blacklist', () => {
      const dependency = {
        license: 'foo'
      };
      const policy = {
        deny: {
          licenses: ['foo']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(true);
    });

    it('does not match for dependency not in license blacklist', () => {
      const dependency = {
        license: 'foo'
      };
      const policy = {
        deny: {
          licenses: ['bar']
        }
      };

      const isMatch = rule.match(dependency, policy);

      expect(isMatch).toBe(false);
    });
  });
});
