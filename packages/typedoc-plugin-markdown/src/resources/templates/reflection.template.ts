import { DeclarationReflection, PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading, unorderedList } from '../../utils/elements';

export const reflectionTemplate = (
  context: MarkdownThemeContext,
  props: PageEvent<DeclarationReflection>,
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

  if (props.model.typeParameters) {
    md.push(heading(2, 'Type parameters'));
    md.push(context.typeParameterTablePartial(props.model.typeParameters));
  }

  if (props.model.typeHierarchy && props.model.typeHierarchy.next) {
    md.push(heading(2, 'Hierarchy'));
    md.push(context.hierarchyPartial(props.model.typeHierarchy));
  }

  if (props.model.implementedTypes) {
    md.push(heading(2, 'Implements'));
    md.push(
      unorderedList(
        props.model.implementedTypes.map((implementedType) =>
          context.typePartial(implementedType),
        ),
      ),
    );
  }

  if (props.model.signatures) {
    md.push(heading(2, 'Callable'));
    props.model.signatures.forEach((signature) => {
      md.push(heading(3, signature.name));
      md.push(context.signaturePartial(signature));
    });
  }

  if (props.model.indexSignature) {
    md.push(heading(2, 'Indexable'));
    md.push(context.indexSignatureTitlePartial(props.model.indexSignature));
  }

  md.push(context.tocPartial(props.model));

  if (props.model.groups) {
    md.push(context.groupsPartial(props.model.groups));
  }

  return md.join('\n\n');
};
