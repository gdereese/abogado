# abogado
Checks a package's dependencies for compliance with a specified licensing policy.

## Summary
Abogado inspects the license type of each Node package dependency referenced by a given package.  It will use either a whitelist or blacklist of license types you specify and identify any violations to that policy.  A detailed report of the audit can be also generated for later review or further action.

For example, this would work very well incorporated into an automated build process so that the build can be failed if a dependency is introduced for which your organization cannot comply with the license terms.
