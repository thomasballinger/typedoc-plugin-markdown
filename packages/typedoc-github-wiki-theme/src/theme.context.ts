import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown/dist/theme';

export class GithubWikiThemeContext extends MarkdownThemeRenderContext {
  override relativeURL = (url: string) => {
    return encodeURI('../wiki/' + url.replace('.md', ''));
  };
}
