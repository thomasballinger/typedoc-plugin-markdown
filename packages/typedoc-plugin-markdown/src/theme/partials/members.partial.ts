import {
  DeclarationReflection,
  ReflectionCategory,
  ReflectionGroup,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { heading, horizontalRule } from '../utils/elements';

export const membersPartial = (
  context: MarkdownThemeRenderContext,
  props: ReflectionGroup[],
) => {
  const md: string[] = [];
  props
    ?.filter((group) => !group.allChildrenHaveOwnDocument())
    .forEach((group) => {
      if (group.categories) {
        group.categories
          ?.filter((category) => !category.allChildrenHaveOwnDocument())
          .forEach((category) => {
            md.push(heading(2, `${group.title}: ${category.title}`));
            md.push(members(context, category));
          });
      } else {
        md.push(heading(2, group.title));
        md.push(members(context, group));
      }
    });
  return md.join('\n\n');
};

function members(
  context: MarkdownThemeRenderContext,
  item: ReflectionGroup | ReflectionCategory,
) {
  const md: string[] = [];
  item.children.forEach((child, index) => {
    md.push(context.memberPartial(child as DeclarationReflection));
    if (index !== item.children.length - 1) {
      md.push(horizontalRule());
    }
  });
  return md.join('\n\n');
}
