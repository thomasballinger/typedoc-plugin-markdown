import { PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';

export function readme(
  context: MarkdownThemeRenderContext,
  page: PageEvent<ProjectReflection>,
) {
  const md: string[] = [];
  if (!context.getOption('hideBreadcrumbs')) {
    md.push(context.partials.breadcrumbs(page));
  }

  if (page.model.readme) {
    md.push(context.partials.commentParts(page.model.readme));
  }

  return md.join('\n\n');
}
