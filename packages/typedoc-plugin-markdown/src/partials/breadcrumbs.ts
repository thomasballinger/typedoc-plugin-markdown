import {
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
} from 'typedoc';
import { bold, link } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars } from '../utils';

export function breadcrumbs(
  context: MarkdownThemeRenderContext,
  page: PageEvent<ProjectReflection | DeclarationReflection>,
) {
  const entryDocument = context.getOption('entryDocument');
  const readme = context.getOption('readme');

  const md: string[] = [];

  if (!readme.endsWith('none')) {
    const mdRoot: string[] = [];
    mdRoot.push(
      page.url === entryDocument
        ? 'Readme'
        : link('Readme', context.relativeURL(entryDocument)),
    );
    mdRoot.push(` \| `);
    mdRoot.push(
      page.url === context.globalsFile
        ? page.project.name
        : link(page.project.name, context.relativeURL(context.globalsFile)),
    );
    md.push(mdRoot.join(''));
  } else {
    md.push(
      page.url === entryDocument
        ? bold(page.project.name)
        : link(page.project?.name, context.relativeURL(entryDocument)),
    );
  }

  const breadcrumb = (model: Reflection, md: string[]) => {
    if (model?.parent) {
      breadcrumb(model.parent, md);
      if (model.url) {
        md.push(
          page.url === model.url
            ? `${escapeChars(model.name)}`
            : `[${escapeChars(model.name)}](${context.urlTo(model)})`,
        );
      }
    }
    return md.join(' / ');
  };
  return breadcrumb(page.model, md);
}
