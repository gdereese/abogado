const validator = require('../src/validator');

describe('validator', () => {
  it('should not allow both allow and deny license lists', () => {
    const settings = {
      package: {},
      policy: {
        allow: {
          licenses: ['foo']
        },
        deny: {
          licenses: ['bar']
        }
      }
    };

    const errors = validator.validate(settings);

    expect(errors.length).toBe(1);
  });

  it('should not allow both allow and deny package lists', () => {
    const settings = {
      package: {},
      policy: {
        allow: {
          packages: ['foo']
        },
        deny: {
          packages: ['bar']
        }
      }
    };

    const errors = validator.validate(settings);

    expect(errors.length).toBe(1);
  });
});
