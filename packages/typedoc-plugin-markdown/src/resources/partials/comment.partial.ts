import { Comment } from 'typedoc';
import { MarkdownThemeContext } from '../../theme.context';

export function commentPartial(
  context: MarkdownThemeContext,
  comment: Comment,
) {
  const md: string[] = [];

  if (comment?.hasVisibleComponent()) {
    if (comment.shortText) {
      md.push(comment.shortText);
    }

    if (comment.text) {
      md.push(comment.text);
    }

    if (comment.tags) {
      const tags = comment.tags.map(
        (tag) =>
          `**\`${tag.tagName}\`**${
            tag.text ? (tag.text.startsWith('\n') ? '' : ' ') + tag.text : ''
          }`,
      );
      md.push(tags.join('\n\n'));
    }

    return md.join('\n\n');
  }
  return '';
}
