import * as validator from '../src/validator';

describe('validator', () => {
  it('should not allow both allow and deny lists', () => {
    const program = {
      allow: ['foo'],
      deny: ['bar']
    };

    const errors = validator.validate(program);

    expect(errors.length).toBe(1);
  });
});