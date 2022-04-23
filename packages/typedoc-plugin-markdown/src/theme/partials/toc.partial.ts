import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionGroup,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { escapeChars } from '../utils/format';

export function tocPartial(
  context: MarkdownThemeRenderContext,
  props: ProjectReflection | DeclarationReflection,
) {
  const md: string[] = [];

  const { hideInPageTOC } = context.options;

  const isVisible = props.groups?.some((group) =>
    group.allChildrenHaveOwnDocument(),
  );

  function pushGroup(group: ReflectionGroup, md: string[]) {
    const children = group.children.map(
      (child) =>
        `- [${escapeChars(child.name)}](${context.relativeURL(child.url)})`,
    );
    md.push(children.join('\n'));
  }

  if ((!hideInPageTOC && props.groups) || (isVisible && props.groups)) {
    if (!hideInPageTOC) {
      md.push(`## Table of contents\n\n`);
    }
    const headingLevel = hideInPageTOC ? `##` : `###`;
    props.groups?.forEach((group) => {
      const groupTitle = group.title;
      if (group.categories) {
        group.categories.forEach((category) => {
          md.push(`${headingLevel} ${category.title} ${groupTitle}\n\n`);
          pushGroup(category as any, md);
          md.push('\n');
        });
      } else {
        if (!hideInPageTOC || group.allChildrenHaveOwnDocument()) {
          md.push(`${headingLevel} ${groupTitle}\n\n`);
          pushGroup(group, md);
          md.push('\n');
        }
      }
    });
  }
  return md.length > 0 ? md.join('\n') : '';
}
