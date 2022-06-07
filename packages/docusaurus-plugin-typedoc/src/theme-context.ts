import * as path from 'path';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

export class DocusaurusThemeContext extends MarkdownThemeRenderContext {
  override relativeURL = (url: string) => {
    const re = new RegExp(
      this.options.getValue('includeExtension') === 'true' ? '' : '.md',
      'g',
    );
    const relativeUrl = this.getRelativeURL(url).replace(re, '');
    if (path.basename(relativeUrl).startsWith('index')) {
      // always remove the extension for the index or else it creates weird paths like `../.md`
      return relativeUrl.replace('index', '').replace('.md', '');
    }
    return relativeUrl;
  };
}
