class Settings {
  constructor(obj) {
    this.outputPath = obj.outputPath;
    this.policy = obj.policy ? new Policy(obj.policy) : null;
    this.verbose = obj.verbose;
  }
}

class Policy {
  constructor(obj) {
    this.allow = obj.allow ? new PolicyList(obj.allow) : null;
    this.deny = obj.deny ? new PolicyList(obj.deny) : null;
  }
}

class PolicyList {
  constructor(obj) {
    this.licenses = obj.licenses;
  }
}

module.exports = Settings;
