# abogado

[![Build Status](https://travis-ci.org/gdereese/abogado.svg?branch=master)](https://travis-ci.org/gdereese/abogado)
[![SonarCloud Quality](https://sonarcloud.io/api/project_badges/measure?project=abogado&metric=alert_status)](https://sonarcloud.io/dashboard?id=abogado)
[![npm version](https://badge.fury.io/js/abogado.svg)](https://badge.fury.io/js/abogado)

Checks a package's dependencies for compliance with a specified licensing policy.

## Summary

Abogado inspects the license type of each Node package dependency referenced by a given package. You can define a policy of allowed/denied licenses and/or individual packages, and abogado will identify any violations to that policy. A detailed report of the audit can be also generated for later review or further action.

For example, this would work very well incorporated into an automated build process so that the build can be failed if a dependency is introduced for which your organization cannot comply with the license terms.

## Installation (NPM)

#### Install as a local dependency

```
npm install abogado
```

#### Install globally

```
npm install abogado -g
```

## Usage

```
Usage: abogado [options]

  Options:
    --allow-licenses <licenses>  List of licenses to allow (supports RegEx patterns)
    --allow-packages <packages>  List of packages to allow (supports RegEx patterns)
    --deny-licenses <licenses>   List of licenses to deny (supports RegEx patterns)
    --deny-packages <packages>   List of packages to deny (supports RegEx patterns)
    -p, --package-dir <path>     Directory of package to audit (must contain package-lock.json) (default: .)
    -o, --output-path <path>     Path to report output file
    -v, --verbose                Enable verbose logging
    -h, --help                   output usage information
```

abogado reviews dependencies by reading the project-lock.json file for the specified package. Therefore, the package being checked
MUST be installed prior to running this utility.

Refer to licenses using their SPDX identifiers. The list of licenses available are here:
https://spdx.org/licenses

Alternatively, options can be read from an `abogado.json` file located in the package root directory.  
In combination, options can also be specified on the command-line to override those options found in the file.

See [Options File Schema](https://github.com/gdereese/abogado/wiki/Options-File-Schema) for more details.

## Examples

You can reference SPDX identifiers for the licenses you want to allow or deny. Alternatively, you can use RegEx patterns to match multiple licenses or package names.

#### Allow only MIT and any version of the Apache license in the current package

```
abogado . --allow-licenses MIT,Apache-
```

#### Allow any license but the Affero GPL

```
abogado . --deny-licenses AGPL-1.0
```

## Further Reading

* [Options File Schema](https://github.com/gdereese/abogado/wiki/Options-File-Schema)
