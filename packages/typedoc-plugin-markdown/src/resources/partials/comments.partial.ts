import { Comment } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

export function commentsPartial(
  context: MarkdownThemeContext,
  comment: Comment,
) {
  const md: string[] = [];

  if (comment?.hasVisibleComponent()) {
    if (comment.shortText) {
      md.push(context.commentPartial(comment.shortText));
    }

    if (comment.text) {
      md.push(context.commentPartial(comment.text));
    }

    if (comment.tags) {
      const tags = comment.tags.map(
        (tag) =>
          `**\`${tag.tagName}\`**${
            tag.text
              ? context.commentPartial(
                  (tag.text.startsWith('\n') ? '' : ' ') + tag.text,
                )
              : ''
          }`,
      );
      md.push(tags.join('\n\n'));
    }

    return md.join('\n\n');
  }
  return '';
}
