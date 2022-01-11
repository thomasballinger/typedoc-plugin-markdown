import { MarkdownThemeContext } from 'typedoc-plugin-markdown';

export class GithubWikiThemeContext extends MarkdownThemeContext {
  relativeURL(url: string | undefined) {
    return url ? encodeURI('../wiki/' + url.replace('.md', '')) : '';
  }

  globalsFile =
    this.options.entryPoints.length > 1 ? 'Modules.md' : 'Exports.md';
}
