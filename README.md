# abogado

[![Build Status](https://travis-ci.org/gdereese/abogado.svg?branch=master)](https://travis-ci.org/gdereese/abogado)
[![SonarCloud Quality](https://sonarcloud.io/api/project_badges/measure?project=abogado&metric=alert_status)](https://sonarcloud.io/dashboard?id=abogado)
[![npm version](https://badge.fury.io/js/abogado.svg)](https://badge.fury.io/js/abogado)

Checks a package's dependencies for compliance with a specified licensing policy.

## Summary

Abogado inspects the license type of each Node package dependency referenced by a given package. It will use either a whitelist or blacklist of license types you specify and identify any violations to that policy. A detailed report of the audit can be also generated for later review or further action.

For example, this would work very well incorporated into an automated build process so that the build can be failed if a dependency is introduced for which your organization cannot comply with the license terms.

## Installation

#### Install locally

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
    -p, --package-dir <path>  Directory of package to audit (must contain package-lock.json) (default: .)
    -a, --allow <licenses>    List of licenses to allow (supports RegEx patterns)
    -d, --deny <licenses>     List of licenses to deny (supports Regex patterns)
    -o, --output-path <path>  Path to report output file
    -v, --verbose             Enable verbose logging
    -h, --help                output usage information
```

abogado reviews dependencies by reading the project-lock.json file for the specified package. Therefore, the package being checked
MUST be installed prior to running this utility.

Refer to licenses using their SPDX identifiers. The list of licenses available are here:
https://spdx.org/licenses

### abogado.json

Alternatively, options can be read from an `abogado.json` file located in the package root directory.  
In combination, options can also be specified on the command-line to override those options found in the file.

```javascript
{
  "outputPath": "path/to/stuff",
  "policy": {
    "allow": {
      "licenses": [
        "foo",
        "bar"
      ]
    },
    "deny": {
      "licenses": [
        "baz",
        "qux"
      ]
    }
  },
  "verbose": true
}
```

## Examples

You can reference SPDX identifiers for the licenses you want to allow or deny. Alternatively, you can use RegEx patterns to match multiple licenses.

#### Allow only MIT and any version of the Apache license in the current package

```
abogado . --allow MIT,Apache-
```

#### Allow any license but the Affero GPL

```
abogado . --deny AGPL-1.0
```
