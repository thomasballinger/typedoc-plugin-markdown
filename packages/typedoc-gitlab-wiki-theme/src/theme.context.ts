import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

export class GitlabWikiThemeContext extends MarkdownThemeRenderContext {
  override relativeURL = (url: string) => {
    const relativeUrl = this.getRelativeURL(url)
      .replace(/(.*).md/, '$1')
      .replace(/ /g, '-');
    return relativeUrl.startsWith('..') ? relativeUrl : './' + relativeUrl;
  };

  override globalsDocument =
    this.getOption('entryPoints')?.length > 1 ? 'Modules.md' : 'Exports.md';
}
