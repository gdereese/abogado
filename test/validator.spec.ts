import * as validator from '../src/validator';

describe('validator', () => {
  it('should not allow both allow and deny lists', () => {
    const program = {
      allow: ['foo'],
      deny: ['bar']
    };

    const isValid = validator.validate(program);

    expect(isValid).toBe(false);
  });
});