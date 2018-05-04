const law = [
  {
    name: 'explicit-deny',
    violationIfMatch: true,
    match: (dependency, policy) =>
      policy.deny &&
      policy.deny.packages &&
      policy.deny.packages.some(p => dependency.name === p)
  },
  {
    name: 'explicit-allow',
    violationIfMatch: false,
    match: (dependency, policy) =>
      policy.allow &&
      policy.allow.packages &&
      policy.allow.packages.some(p => dependency.name === p)
  },
  {
    name: 'inherited-deny',
    violationIfMatch: true,
    match: (dependency, policy) =>
      policy.deny &&
      policy.deny.licenses &&
      policy.deny.licenses.some(l => dependency.license === l)
  },
  {
    name: 'inherited-allow',
    violationIfMatch: false,
    match: (dependency, policy) =>
      !policy.allow ||
      !policy.allow.licenses ||
      policy.allow.licenses.some(l => dependency.license === l)
  }
];

module.exports = law;
