import * as Handlebars from 'handlebars';
import { PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeContext } from '../..';

export const readmeTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<ProjectReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (props.model.readme) {
    md.push(Handlebars.helpers.comment.call(props.model.readme));
  }
  return md.join('\n\n');
};
