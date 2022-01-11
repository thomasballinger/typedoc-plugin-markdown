import { Renderer, DeclarationReflection } from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { loadSidebar } from './sidebar';
import { GitlabWikiThemeContext } from './theme-context';
import { GitlabWikiThemeOptionsReader } from './options-reader';

export class GitlabWikiTheme extends MarkdownTheme {
  private _contextCache?: GitlabWikiThemeContext;
  override getRenderContext() {
    if (!this._contextCache) {
      this._contextCache = new GitlabWikiThemeContext(
        this,
        this.application.options,
      );
    }
    return this._contextCache;
  }

  constructor(renderer: Renderer) {
    super(renderer);
    this.application.options.addReader(new GitlabWikiThemeOptionsReader());
    loadSidebar(this.application);
  }

  toUrl(mapping: any, reflection: DeclarationReflection) {
    return `${mapping.directory}/${reflection.getFullName()}.md`;
  }
}
