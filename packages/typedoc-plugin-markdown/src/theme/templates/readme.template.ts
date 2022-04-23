import { PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';

export const readmeTemplate = (
  context: MarkdownThemeRenderContext,
  props: PageEvent<ProjectReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (props.model.readme) {
    md.push(props.model.readme);
  }
  return md.join('\n\n');
};
