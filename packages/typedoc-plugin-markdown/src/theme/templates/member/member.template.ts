import { DeclarationReflection, PageEvent } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { heading } from '../../theme.utils';

export const memberTemplate = (
  context: MarkdownThemeRenderContext,
  props: PageEvent<DeclarationReflection>,
) => {
  const md: string[] = [];

  if (!context.getOption('hideBreadcrumbs')) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (!context.getOption('hidePageTitle')) {
    md.push(heading(1, context.pageTitlePartial(props, true)));
  }

  if (props.model) {
    md.push(context.memberPartial(props.model));
  }

  return md.join('\n\n');
};
