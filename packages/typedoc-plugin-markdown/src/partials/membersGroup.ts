import { ReflectionGroup } from 'typedoc';
import { heading, horizontalRule } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function membersGroup(
  context: MarkdownThemeRenderContext,
  group: ReflectionGroup,
) {
  const out: string[] = [];
  if (group.categories) {
    group.categories.forEach((groupItem) =>
      groupItem.children.forEach((item) => {
        out.push(context.partials.member(item));
      }),
    );
  } else {
    out.push(heading(2, group.title));
    group.children
      .filter((item) => !item.hasOwnDocument)
      .forEach((groupChild, index) => {
        out.push(context.partials.member(groupChild));
        if (index !== group.children.length - 1) {
          out.push(horizontalRule());
        }
      });
  }
  return out.join('\n\n');
}
