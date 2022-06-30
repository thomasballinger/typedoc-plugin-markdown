import { DeclarationReflection, PageEvent } from 'typedoc';
import { heading, unorderedList } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function reflection(
  context: MarkdownThemeRenderContext,
  page: PageEvent<DeclarationReflection>,
) {
  const md: string[] = [];

  if (!context.getOption('hideBreadcrumbs')) {
    md.push(context.partials.breadcrumbs(page));
  }

  if (!context.getOption('hidePageTitle')) {
    md.push(heading(1, context.partials.reflectionTitle(page.model, true)));
  }

  if (page.model.comment) {
    md.push(context.partials.comment(page.model.comment));
  }

  if (page.model.typeParameters) {
    md.push(heading(2, 'Type parameters'));
    md.push(context.partials.typeParameterTable(page.model.typeParameters));
  }

  if (page.model.typeHierarchy) {
    if (page.model?.typeHierarchy?.next) {
      md.push(heading(2, 'Hierarchy'));
      md.push(context.partials.hierarchy(page.model.typeHierarchy));
    }
  }
  if (page.model?.implementedTypes) {
    md.push(heading(2, 'Implements'));
    md.push(
      unorderedList(
        page.model.implementedTypes.map((implementedType) =>
          context.partials.someType(implementedType),
        ),
      ),
    );
  }

  if ('signatures' in page.model && page.model?.signatures) {
    md.push(heading(2, 'Callable'));
    page.model.signatures.forEach((signature) => {
      md.push(heading(3, signature.name));
      md.push(context.partials.memberSignature(signature));
    });
  }

  if ('indexSignature' in page.model && page.model.indexSignature) {
    md.push(heading(2, 'Indexable'));
    md.push('context.indexSignaturePartial(props.model.indexSignature)');
  }

  md.push(context.partials.toc(page.model));

  if (page.model.groups) {
    page.model.groups
      .filter((group) => !group.allChildrenHaveOwnDocument())
      .forEach((group) => {
        md.push(context.partials.membersGroup(group));
      });
  }

  return md.join('\n\n');
}
