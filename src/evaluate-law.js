function evaluateLaw(pkg, policy, law) {
  const violations = pkg.dependencies.reduce((v, d) => {
    // dependency is considered a violation upon the first deny-type rule that is broken
    let brokenRule = null;
    for (const rule of law) {
      const isMatch = rule.match(d, policy);

      if (isMatch && rule.isViolationIfMatch) {
        brokenRule = rule;
        break;
      }
    }

    if (brokenRule) {
      v.push({
        dependencyName: d.name,
        reason: brokenRule.name
      });
    }

    return v;
  }, []);

  return violations;
}

module.exports = evaluateLaw;
