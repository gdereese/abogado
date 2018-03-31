const path = require('path');
const program = require('commander');

const processor = require('./processor');
const settingsProvider = require('./settings-provider');

program
  .option(
    '-p, --package-dir <path>',
    'Directory of package to audit (must contain package-lock.json)',
    '.'
  )
  .option(
    '-a, --allow <licenses>',
    'List of licenses to allow (supports RegEx patterns)',
    split
  )
  .option(
    '-d, --deny <licenses>',
    'List of licenses to deny (supports Regex patterns)',
    split
  )
  .option('-o, --output-path <path>', 'Path to report output file')
  .option('-v, --verbose', 'Enable verbose logging')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

// look for settings file in specified package dir,
// fallback to current directory if not specified
const settingsFilePath = path.resolve(program.packageDir, 'abogado.json');
const settings = settingsProvider.getSettings(settingsFilePath, program);

processor.run(settings);

function split(val) {
  return val.split(',');
}
