import { MarkdownTheme } from 'typedoc-plugin-markdown';

export class BitbucketTheme extends MarkdownTheme {
  override getAnchor(reflectionId: string) {
    return 'markdown-header-' + reflectionId;
  }
}
