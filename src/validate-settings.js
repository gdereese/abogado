function validateSettings(settings) {
  const errors = [];

  if (
    settings.policy &&
    settings.policy.allow &&
    settings.policy.allow.licenses &&
    settings.policy.allow.licenses.length > 0 &&
    settings.policy.deny &&
    settings.policy.deny.licenses &&
    settings.policy.deny.licenses.length > 0
  ) {
    errors.push(
      'Only one of allow or deny licenses lists must be specified, not both'
    );
  }

  if (
    settings.policy &&
    settings.policy.allow &&
    settings.policy.allow.packages &&
    settings.policy.allow.packages.length > 0 &&
    settings.policy.deny &&
    settings.policy.deny.packages &&
    settings.policy.deny.packages.length > 0
  ) {
    errors.push(
      'Only one of allow or deny packages lists must be specified, not both'
    );
  }

  if (!settings.package) {
    errors.push('Package to audit was not included');
  }

  return errors;
}

module.exports = validateSettings;
