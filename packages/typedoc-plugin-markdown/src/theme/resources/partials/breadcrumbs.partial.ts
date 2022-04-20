import { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';
import { escapeChars } from '../../../utils/format';
import { MarkdownThemeRenderContext } from '../../theme.context';

export function breadcrumbsPartial(
  context: MarkdownThemeRenderContext,
  props: PageEvent<ProjectReflection | DeclarationReflection>,
) {
  const { entryPoints, entryDocument, readme } = context.options;
  const project = { name: 'x', url: 'x' };

  if (!project) {
    return '';
  }

  const hasReadmeFile = !readme.endsWith('none');
  const breadcrumbs: string[] = [];
  const globalsName = entryPoints.length > 1 ? 'Modules' : 'Exports';
  breadcrumbs.push(
    props.url === entryDocument
      ? project.name
      : `[${project.name}](${context.relativeURL(entryDocument)})`,
  );
  if (hasReadmeFile) {
    breadcrumbs.push(
      props.url === project.url
        ? globalsName
        : `[${globalsName}](${context.relativeURL('modules.md')})`,
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
