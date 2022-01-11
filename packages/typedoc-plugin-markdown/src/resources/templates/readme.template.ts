import { PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../..';

export const readmeTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<any>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (props.model.readme) {
    md.push(context.commentPartial(props.model.readme));
  }
  return md.join('\n\n');
};
