import { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { escapeChars } from '../utils/format';

export function breadcrumbsPartial(
  context: MarkdownThemeRenderContext,
  props: PageEvent<ProjectReflection | DeclarationReflection>,
) {
  const { entryPoints, entryDocument, readme } = context.options;

  const noReadme = readme.endsWith('none');
  const breadcrumbs: string[] = [];
  const globalsName = entryPoints.length > 1 ? 'Modules' : 'Exports';
  breadcrumbs.push(
    props.url === entryDocument
      ? context.project?.name
      : `[${context.project?.name}](${context.relativeURL(entryDocument)})`,
  );
  if (!noReadme) {
    breadcrumbs.push(
      props.url === context.project?.url
        ? globalsName
        : `[${globalsName}](${context.relativeURL(context.modulesFileName)})`,
    );
  }
  function breadcrumb(page: PageEvent, model: any, md: string[]) {
    if (model && model.parent) {
      breadcrumb(page, model.parent, md);
      if (model.url) {
        md.push(
          page.url === model.url
            ? `${escapeChars(model.name)}`
            : `[${escapeChars(model.name)}](${context.relativeURL(model.url)})`,
        );
      }
    }
    return md.join(' / ');
  }
  const breadcrumbsOut = breadcrumb(props, props.model, breadcrumbs);
  return breadcrumbsOut;
}
