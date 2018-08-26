function evaluateLaw(pkg, policy, law) {
  const violations = pkg.dependencies.reduce((v, d) => {
    // dependency is considered a violation upon the first deny-type rule that is broken
    const brokenRule = law.find(
      r => r.match(d, policy) && r.isViolationIfMatch
    );

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
