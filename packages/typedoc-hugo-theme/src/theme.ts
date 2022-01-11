import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { loadFrontMatter } from './plugins/front-matter';
import { HugoThemeOptionsReader } from './options-reader';
import { Renderer } from 'typedoc';
import { loadSidebar } from './plugins/sidebar';

export class HugoTheme extends MarkdownTheme {
  constructor(renderer: Renderer) {
    super(renderer);
    this.application.options.addReader(new HugoThemeOptionsReader());
    loadFrontMatter(this.application);
    loadSidebar(this.application);
  }
}
