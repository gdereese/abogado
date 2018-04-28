const paralegal = {
  evaluate(pkg, policy) {
    const violations = [];

    Array.prototype.push.apply(
      violations,
      evaluatePolicy({
        package: pkg,
        dependencyProperty: 'license',
        rules: policy.allow && policy.allow.licenses,
        rulesType: 'white',
        reasonBuilder: dependency =>
          `License '${
            dependency.license
          }' is not explicitly permitted by policy.`
      })
    );

    Array.prototype.push.apply(
      violations,
      evaluatePolicy({
        package: pkg,
        dependencyProperty: 'name',
        rules: policy.allow && policy.allow.packages,
        rulesType: 'white',
        reasonBuilder: dependency =>
          `Package '${dependency.name}' is not explicitly permitted by policy.`
      })
    );

    Array.prototype.push.apply(
      violations,
      evaluatePolicy({
        package: pkg,
        dependencyProperty: 'license',
        rules: policy.deny && policy.deny.licenses,
        rulesType: 'black',
        reasonBuilder: dependency =>
          `License '${dependency.license}' is explicitly prohibited by policy.`
      })
    );

    Array.prototype.push.apply(
      violations,
      evaluatePolicy({
        package: pkg,
        dependencyProperty: 'name',
        rules: policy.deny && policy.deny.packages,
        rulesType: 'black',
        reasonBuilder: dependency =>
          `Package '${dependency.name}' is explicitly prohibited by policy.`
      })
    );

    return violations;
  }
};

function evaluatePolicy(params) {
  if (!params.rules || params.rules.length === 0) {
    return [];
  }

  const violators = params.package.dependencies.filter(dependency => {
    switch (params.rulesType) {
      case 'white':
        return !params.rules.some(pattern =>
          new RegExp(pattern).test(dependency[params.dependencyProperty])
        );
      case 'black':
        return params.rules.some(pattern =>
          new RegExp(pattern).test(dependency[params.dependencyProperty])
        );
    }
  });

  const violations = violators.map(dependency => {
    return {
      dependencyName: dependency.name,
      reason: params.reasonBuilder(dependency)
    };
  });

  return violations || [];
}

module.exports = paralegal;
