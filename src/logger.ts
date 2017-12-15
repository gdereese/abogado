import * as chalk from 'chalk';
import * as program from 'commander';

export function error(text: string) {
  return console.error(chalk.default.red(text));
}

export function info(text: string) {
  return console.log(text);
}

export function verbose(text: string) {
  if (program.verbose) {
    return console.log(text);
  }
}