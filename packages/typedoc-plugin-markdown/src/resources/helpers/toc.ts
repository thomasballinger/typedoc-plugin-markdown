import * as Handlebars from 'handlebars/runtime';
import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionGroup,
} from 'typedoc';
import { HelperOptions } from '../../utils/models';

export const toc = (
  props: ProjectReflection | DeclarationReflection,
  options: HelperOptions,
) => {
  const md: string[] = [];

  const hideInPageTOC = options.data?.options.hideInPageTOC;

  const isVisible = props.groups?.some((group) =>
    group.allChildrenHaveOwnDocument(),
  );

  function pushGroup(group: ReflectionGroup, md: string[]) {
    const children = group.children.map(
      (child) =>
        `- [${Handlebars.helpers.escapeChars(
          child.name,
        )}](${Handlebars.helpers.relativeURL(child.url)})`,
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
  return md.length > 0 ? md.join('\n') : null;
};
