const _ = require('lodash');

const paralegal = {
  evaluate(pkg, policy) {
    const violations = [];

    Array.prototype.push.apply(
      violations,
      evaluatePolicy({
        package: pkg,
        dependencyProperty: 'license',
        policy,
        rulesPath: 'allow.licenses',
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
        policy,
        rulesPath: 'allow.packages',
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
        policy,
        rulesPath: 'deny.licenses',
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
        policy,
        rulesPath: 'deny.packages',
        rulesType: 'black',
        reasonBuilder: dependency =>
          `Package '${dependency.name}' is explicitly prohibited by policy.`
      })
    );

    return violations;
  }
};

function evaluatePolicy(params) {
  const rules = _.get(params, `policy.${params.rulesPath}`);
  if (!rules || rules.length === 0) {
    return [];
  }

  const violators = _.filter(params.package.dependencies, dependency => {
    switch (params.rulesType) {
      case 'white':
        return !_.some(rules, pattern =>
          new RegExp(pattern).test(dependency[params.dependencyProperty])
        );
      case 'black':
        return _.some(rules, pattern =>
          new RegExp(pattern).test(dependency[params.dependencyProperty])
        );
    }
  });

  const violations = _.map(violators, dependency => {
    return {
      dependencyName: dependency.name,
      reason: params.reasonBuilder(dependency)
    };
  });

  return violations || [];
}

module.exports = paralegal;
