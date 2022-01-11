import { PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const reflectionMemberTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<any>,
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
    md.push(context.memberContainerPartial(props.model));
  }

  return md.join('\n\n');
};
