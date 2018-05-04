const paralegal = {
  evaluate(pkg, policy, law) {
    const violations = [];

    for (const dependency of pkg.dependencies) {
      // dependency is considered a violation upon the first deny-type rule that is broken
      let brokenRule = null;

      for (const rule of law) {
        const isMatch = rule.match(dependency, policy);

        if (isMatch && rule.isViolationIfMatch) {
          brokenRule = rule;
          break;
        }
      }

      if (brokenRule) {
        violations.push({
          dependencyName: dependency.name,
          reason: brokenRule.name
        });
      }
    }

    return violations;
  }
};

module.exports = paralegal;
