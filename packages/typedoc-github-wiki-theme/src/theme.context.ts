import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

export class GithubWikiThemeContext extends MarkdownThemeRenderContext {
  override relativeURL = (url: string) => {
    return encodeURI('../wiki/' + url.replace('.md', ''));
  };

  override globalsDocument =
    this.getOption('entryPoints')?.length > 1 ? 'Modules.md' : 'Exports.md';
}
