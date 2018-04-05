const validator = {
  validate(program) {
    const errors = [];

    if (
      program.allowLicenses &&
      program.allowLicenses.length > 0 &&
      program.denyLicenses &&
      program.denyLicenses.length > 0
    ) {
      errors.push(
        'Only one of allow or deny licenses lists must be specified, not both'
      );
    }

    if (
      program.allowPackages &&
      program.allowPackages.length > 0 &&
      program.denyPackages &&
      program.denyPackages.length > 0
    ) {
      errors.push(
        'Only one of allow or deny packages lists must be specified, not both'
      );
    }

    return errors;
  }
};

module.exports = validator;
