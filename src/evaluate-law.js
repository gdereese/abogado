// dependency is considered a violation upon the first deny-type rule that is broken
const isBrokenRule = (dependency, policy) => rule =>
  rule.match(dependency, policy) && rule.isViolationIfMatch;

function evaluateLaw(pkg, policy, law) {
  const violations = pkg.dependencies.reduce((v, d) => {
    const brokenRule = law.find(isBrokenRule(d, policy));

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
