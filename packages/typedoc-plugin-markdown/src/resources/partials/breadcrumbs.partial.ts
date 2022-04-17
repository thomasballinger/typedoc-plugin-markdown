import * as Handlebars from 'handlebars';
import { ContainerReflection, PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';
import { escapeChars } from '../../utils';

export function breadcrumbsPartial(
  context: MarkdownThemeContext,
  props: PageEvent<ContainerReflection>,
) {
  const { entryPoints, entryDocument, readme } = context.options;
  const project = context.project();

  if (!project) {
    return '';
  }

  const hasReadmeFile = !readme.endsWith('none');
  const breadcrumbs: string[] = [];
  const globalsName = entryPoints.length > 1 ? 'Modules' : 'Exports';
  breadcrumbs.push(
    props.url === entryDocument
      ? project.name
      : `[${project.name}](${Handlebars.helpers.relativeURL(entryDocument)})`,
  );
  if (hasReadmeFile) {
    breadcrumbs.push(
      props.url === project.url
        ? globalsName
        : `[${globalsName}](${Handlebars.helpers.relativeURL('modules.md')})`,
    );
  }
  const breadcrumbsOut = breadcrumb(props, props.model, breadcrumbs);
  return breadcrumbsOut;
}

function breadcrumb(page: PageEvent, model: any, md: string[]) {
  if (model && model.parent) {
    breadcrumb(page, model.parent, md);
    if (model.url) {
      md.push(
        page.url === model.url
          ? `${escapeChars(model.name)}`
          : `[${escapeChars(model.name)}](${Handlebars.helpers.relativeURL(
              model.url,
            )})`,
      );
    }
  }
  return md.join(' / ');
}
