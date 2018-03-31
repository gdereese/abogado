const validator = {
  validate(program) {
    const errors = [];

    if (
      program.allow &&
      program.allow.length > 0 &&
      program.deny &&
      program.deny.length > 0
    ) {
      errors.push('One one of allow or deny lists must be specified, not both');
    }

    return errors;
  }
};

module.exports = validator;
