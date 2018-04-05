const validator = require('../src/validator');

describe('validator', () => {
  it('should not allow both allow and deny license lists', () => {
    const program = {
      allowLicenses: ['foo'],
      denyLicenses: ['bar']
    };

    const errors = validator.validate(program);

    expect(errors.length).toBe(1);
  });

  it('should not allow both allow and deny package lists', () => {
    const program = {
      allowPackages: ['foo'],
      denyPackages: ['bar']
    };

    const errors = validator.validate(program);

    expect(errors.length).toBe(1);
  });
});
