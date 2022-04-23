import { DeclarationReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { heading } from '../utils/elements';

export const declarationPartial = (
  context: MarkdownThemeRenderContext,
  model: DeclarationReflection,
) => {
  const md: string[] = [];

  const typeDeclaration = (model.type as any)
    ?.declaration as DeclarationReflection;

  md.push(context.declarationTitlePartial(model));

  if (model.comment) {
    md.push(context.commentPartial(model.comment));
  }

  if (model.typeParameters) {
    md.push(heading(4, 'Type parameters'));
    md.push(context.typeParameterTablePartial(model.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    md.push(heading(4, 'Index signature'));
    md.push(context.indexSignatureTitlePartial(typeDeclaration.indexSignature));
  }

  if (typeDeclaration?.signatures) {
    md.push(
      heading(
        4,
        typeDeclaration.children ? 'Call signature' : 'Type declaration',
      ),
    );
    typeDeclaration.signatures.forEach((signature) => {
      md.push(context.signaturePartial(signature, true));
    });
  }

  if (typeDeclaration?.children) {
    md.push(heading(4, 'Type declaration'));
    md.push(context.propertyTablePartial(typeDeclaration.children));
  }

  md.push(context.sourcesPartial(model));

  return md.join('\n\n');
};
