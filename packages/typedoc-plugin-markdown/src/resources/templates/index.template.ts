import { PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const indexTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<ProjectReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (!context.options.hidePageTitle) {
    md.push(heading(1, context.reflectionTitlePartial(props, true)));
  }

  md.push(context.reflectionPathPartial(props.model));

  if (props.model.comment) {
    md.push(context.commentPartial(props.model.comment));
  }

  md.push(context.tocPartial(props.model));

  return md.join('\n\n');
};
