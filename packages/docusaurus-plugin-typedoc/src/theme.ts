import { ReflectionKind } from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { DocusaurusThemeContext } from './theme-context';

export class DocusaurusTheme extends MarkdownTheme {
  private _contextCache?: DocusaurusThemeContext;
  override getRenderContext() {
    if (!this._contextCache) {
      this._contextCache = new DocusaurusThemeContext(
        this,
        this.application.options,
      );
    }
    return this._contextCache;
  }

  override mappings() {
    return super.mappings().map((mapping) => {
      if (mapping.kind.includes(ReflectionKind.Namespace)) {
        return {
          ...mapping,
          directory: 'namespaces',
        };
      }
      return mapping;
    });
  }
}
