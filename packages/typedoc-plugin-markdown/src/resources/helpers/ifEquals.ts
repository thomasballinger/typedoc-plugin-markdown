import { HelperOptions } from '../../utils/models';

export function ifEquals(a: string, b: string, options: HelperOptions) {
  return a === b ? options.fn(this) : options.inverse(this);
}
