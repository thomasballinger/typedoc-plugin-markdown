import { Renderer } from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { loadSidebar } from './sidebar';
import { GithubWikiThemeContext } from './theme-context';
import { GithubWikiThemeOptionsReader } from './options-reader';

export class GithubWikiTheme extends MarkdownTheme {
  private _contextCache?: GithubWikiThemeContext;

  constructor(renderer: Renderer) {
    super(renderer);
    this.application.options.addReader(new GithubWikiThemeOptionsReader());
    loadSidebar(this.application);
  }

  override getRenderContext() {
    if (!this._contextCache) {
      this._contextCache = new GithubWikiThemeContext(
        this,
        this.application.options,
      );
    }
    return this._contextCache;
  }
}
