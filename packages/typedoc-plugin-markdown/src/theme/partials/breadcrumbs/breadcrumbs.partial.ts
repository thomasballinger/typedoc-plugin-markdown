import { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { escapeChars } from '../../theme.utils';

export const breadcrumbsPartial = (
  context: MarkdownThemeRenderContext,
  props: PageEvent<ProjectReflection | DeclarationReflection>,
) => {
  const entryPoints = context.getOption('entryPoints');
  const entryDocument = context.getOption('entryDocument');
  const readme = context.getOption('readme');

  const md: string[] = [];

  const globalsName = entryPoints.length > 1 ? 'Modules' : 'Exports';
  md.push(
    props.url === entryDocument
      ? context.project?.name
      : `[${context.project?.name}](${context.relativeURL(entryDocument)})`,
  );
  if (!readme.endsWith('none')) {
    md.push(
      props.url === context.project?.url
        ? globalsName
        : `[${globalsName}](${context.relativeURL(context.modulesFileName)})`,
    );
  }

  const breadcrumbsOut = breadcrumb(context, props, props.model, md);
  return breadcrumbsOut;
};

const breadcrumb = (
  context: MarkdownThemeRenderContext,
  page: PageEvent,
  model: any,
  md: string[],
) => {
  if (model && model.parent) {
    breadcrumb(context, page, model.parent, md);
    if (model.url) {
      md.push(
        page.url === model.url
          ? `${escapeChars(model.name)}`
          : `[${escapeChars(model.name)}](${context.relativeURL(model.url)})`,
      );
    }
  }
  return md.join(' / ');
};
