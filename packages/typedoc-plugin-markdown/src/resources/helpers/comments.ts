import * as Handlebars from 'handlebars';
import { Comment } from 'typedoc';

export default function () {
  Handlebars.registerHelper('comments', function (comment: Comment) {
    const md: string[] = [];

    if (comment?.hasVisibleComponent()) {
      if (comment.shortText) {
        md.push(Handlebars.helpers.comment.call(comment.shortText));
      }

      if (comment.text) {
        md.push(Handlebars.helpers.comment.call(comment.text));
      }

      if (comment.tags) {
        const tags = comment.tags.map(
          (tag) =>
            `**\`${tag.tagName}\`**${
              tag.text
                ? Handlebars.helpers.comment.call(
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
  });
}
