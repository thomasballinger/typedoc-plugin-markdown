import { DeclarationReflection, PageEvent } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { heading } from '../utils/elements';

export const memberTemplate = (
  context: MarkdownThemeRenderContext,
  props: PageEvent<DeclarationReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (!context.options.hidePageTitle) {
    md.push(heading(1, context.reflectionTitlePartial(props, true)));
  }

  md.push(context.reflectionPathPartial(props.model));

  if (props.model) {
    md.push(context.memberPartial(props.model));
  }

  return md.join('\n\n');
};
