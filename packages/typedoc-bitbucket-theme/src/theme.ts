import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown/dist/theme';

class MyThemeContext extends MarkdownThemeRenderContext {
  // Important: If you use `this`, this function MUST be bound! Template functions are free
  // to destructure the context object to only grab what they care about.
}

export class BitbucketTheme extends MarkdownTheme {
  /* private _contextCache?: MyThemeContext;
  override getRenderContext() {
    this._contextCache ||= new MyThemeContext(this, this.application.options);
    return this._contextCache;
  }*/

  override toAnchorRef(reflectionId: string) {
    return 'markdown-header-' + reflectionId;
  }
  /*
  getUrls(project): UrlMapping[] {
    console.log('hello');
    return super.getUrls(project).map((url: UrlMapping) => {
      console.log(url.model.isLeaf);
      return { ...url, url: url + 'x' };
    });
  }*/
}

/*export class BitbucketTheme extends MarkdownTheme {
  constructor(renderer: Renderer) {
    super(renderer);
  }
  toAnchorRef(reflectionId: string) {
    return 'markdown-header-' + reflectionId;
  }
}*/
