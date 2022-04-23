import { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';
import { MarkdownThemeContext } from '..';
import { heading, unorderedList } from '../utils/elements';

export const reflectionTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<ProjectReflection | DeclarationReflection>,
) => {
  const md: string[] = [];

  if (!context.options.hideBreadcrumbs) {
    md.push(context.breadcrumbsPartial(props));
  }

  if (!context.options.hidePageTitle) {
    md.push(heading(1, context.reflectionTitlePartial(props, true)));
  }

  md.push(context.reflectionPathPartial(props.model));

  if (props.model.comment) {
    md.push(context.commentPartial(props.model.comment));
  }

  if ('typeParameters' in props.model) {
    md.push(heading(2, 'Type parameters'));
    md.push(context.typeParameterTablePartial(props.model.typeParameters));
  }

  if ('typeHierarchy' in props.model) {
    if (props.model?.typeHierarchy?.next) {
      md.push(heading(2, 'Hierarchy'));
      md.push(context.hierarchyPartial(props.model.typeHierarchy));
    }
  }
  if ('implementedTypes' in props.model && props.model?.implementedTypes) {
    md.push(heading(2, 'Implements'));
    md.push(
      unorderedList(
        props.model.implementedTypes.map((implementedType) =>
          context.typePartial(implementedType),
        ),
      ),
    );
  }

  if ('signatures' in props.model && props.model?.signatures) {
    md.push(heading(2, 'Callable'));
    props.model.signatures.forEach((signature) => {
      md.push(heading(3, signature.name));
      md.push(context.signaturePartial(signature));
    });
  }

  if ('indexSignature' in props.model && props.model.indexSignature) {
    md.push(heading(2, 'Indexable'));
    md.push(context.indexSignatureTitlePartial(props.model.indexSignature));
  }

  md.push(context.tocPartial(props.model));

  if (props.model.groups) {
    md.push(context.groupsPartial(props.model.groups));
  }

  return md.join('\n\n');
};
