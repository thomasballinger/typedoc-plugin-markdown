import {
  DeclarationReflection,
  ReflectionCategory,
  ReflectionGroup,
} from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading, horizontalRule } from '../../utils/elements';

export const groupsPartial = (
  context: MarkdownThemeContext,
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
            md.push(heading(2, `${group.title} ${category.title}`));
            md.push(getMembers(category));
          });
      } else {
        md.push(heading(2, group.title));
        md.push(getMembers(group));
      }
    });
  return md.join('\n\n');

  function getMembers(item: ReflectionGroup | ReflectionCategory) {
    const md: string[] = [];
    item.children.forEach((child, index) => {
      md.push(context.memberContainerPartial(child as DeclarationReflection));
      if (index !== item.children.length - 1) {
        md.push(horizontalRule());
      }
    });
    return md.join('\n\n');
  }
};
