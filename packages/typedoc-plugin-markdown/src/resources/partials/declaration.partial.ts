import * as Handlebars from 'handlebars';
import { DeclarationReflection } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const declarationPartial = (
  context: MarkdownThemeContext,
  model: DeclarationReflection,
) => {
  const md: string[] = [];

  const typeDeclaration = (model.type as any)
    ?.declaration as DeclarationReflection;

  md.push(Handlebars.helpers.declarationTitle.call(model));

  if (model.comment) {
    md.push(Handlebars.helpers.comments(model.comment));
  }

  if (model.typeParameters) {
    md.push(heading(4, 'Type parameters'));
    md.push(Handlebars.helpers.typeParameterTable.call(model.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    md.push(heading(4, 'Index signature'));
    md.push(
      Handlebars.helpers.indexSignatureTitle.call(
        typeDeclaration.indexSignature,
      ),
    );
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
    md.push(Handlebars.helpers.propertyTable.call(typeDeclaration.children));
  }

  md.push(context.sourcesPartial(model));

  return md.join('\n\n');
};
