import { PageEvent, ProjectReflection } from 'typedoc';
import { heading } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function project(
  context: MarkdownThemeRenderContext,
  page: PageEvent<ProjectReflection>,
) {
  const md: string[] = [];

  if (!context.getOption('hideBreadcrumbs')) {
    md.push(context.partials.breadcrumbs(page));
  }

  md.push(heading(1, page.project.name));

  md.push(context.partials.toc(page.model));

  if (page.model.groups) {
    page.model.groups
      .filter((group) => !group.allChildrenHaveOwnDocument())
      .forEach((group) => {
        md.push(context.partials.membersGroup(group));
      });
  }

  return md.join('\n\n');
}
