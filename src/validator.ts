import * as logger from './logger';

export function validate(program: any): boolean {
  if (program.allow && program.allow.length > 0 && program.deny && program.deny.length > 0) {
    logger.error('*** ERROR: One one of allow or deny lists must be specified, not both');
    return false;
  }

  return true;
}