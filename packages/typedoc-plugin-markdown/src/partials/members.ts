import { ContainerReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';

export function members(
  context: MarkdownThemeRenderContext,
  props: ContainerReflection,
) {
  const md: string[] = [];
  if (props.categories && props.categories.length) {
    props.categories
      .filter((category) => !category.allChildrenHaveOwnDocument())
      .forEach((item) =>
        item.children
          .filter((item) => !item.hasOwnDocument)
          .forEach((item) => {
            md.push(context.partials.member(item));
          }),
      );
  } else {
    props.groups
      ?.filter((group) => !group.allChildrenHaveOwnDocument())
      .forEach((group) => {
        md.push(context.partials.membersGroup(group));
      });
  }
  return md.join('\n');
}
