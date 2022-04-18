import { DeclarationReflection, PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const memberTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<DeclarationReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (!context.options.hidePageTitle) {
    md.push(heading(1, Handlebars.helpers.reflectionTitle.call(props, true)));
  }

  md.push(context.reflectionPathPartial(props.model));

  if (props.model) {
    md.push(context.memberPartial(props.model));
  }

  return md.join('\n\n');
};
