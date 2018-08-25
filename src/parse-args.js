function parseArgs(options) {
  const split = value => value.split(',');

  options.program
    .option(
      '--allow-licenses <licenses>',
      'List of licenses to allow (supports RegEx patterns)',
      split
    )
    .option(
      '--allow-packages <packages>',
      'List of packages to allow (supports RegEx patterns)',
      split
    )
    .option(
      '--deny-licenses <licenses>',
      'List of licenses to deny (supports RegEx patterns)',
      split
    )
    .option(
      '--deny-packages <packages>',
      'List of packages to deny (supports RegEx patterns)',
      split
    )
    .option(
      '-p, --package-dir <path>',
      'Directory of package to audit (must contain package-lock.json)',
      '.'
    )
    .option('-o, --output-path <path>', 'Path to report output file')
    .option('-v, --verbose', 'Enable verbose logging')
    .parse(process.argv);

  return options.program.opts();
}

module.exports = parseArgs;
