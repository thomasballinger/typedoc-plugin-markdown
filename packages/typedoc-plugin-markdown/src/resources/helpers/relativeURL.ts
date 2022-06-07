import * as path from 'path';
import { HelperOptions } from '../../utils/models';

export const relativeURL = (
  url: string | undefined,
  options: HelperOptions,
) => {
  console.log(url, options);
  const publicPath = options.data?.options?.publicPath;
  if (!url || !options.data?.activeLocation) {
    return '';
  }

  if (/^(http|ftp)s?:\/\//.test(url)) {
    return url;
  }

  if (publicPath) {
    return publicPath + url;
  }

  const relative = path.relative(
    path.dirname(options.data.activeLocation),
    path.dirname(url),
  );

  return path.join(relative, path.basename(url)).replace(/\\/g, '/');
};
