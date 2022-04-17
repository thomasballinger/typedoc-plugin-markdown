import * as Handlebars from 'handlebars';
import { PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const indexTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<ProjectReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(Handlebars.helpers.breadcrumbs.call(props));
  }

  if (!context.options.hidePageTitle) {
    md.push(heading(1, Handlebars.helpers.reflectionTitle.call(props, true)));
  }

  md.push(Handlebars.helpers.reflectionPath.call(props.model));

  if (props.model.comment) {
    md.push(Handlebars.helpers.comments(props.model.comment));
  }

  md.push(Handlebars.helpers.toc.call(props.model));

  return md.join('\n\n');
};
