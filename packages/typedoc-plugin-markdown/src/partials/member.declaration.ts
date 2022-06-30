import { DeclarationReflection } from 'typedoc';
import { heading } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function declaration(
  context: MarkdownThemeRenderContext,
  reflection: DeclarationReflection,
) {
  const md: string[] = [];

  md.push(context.partials.declarationTitle(reflection));

  const typeDeclaration = (reflection.type as any)
    ?.declaration as DeclarationReflection;

  if (reflection.comment) {
    md.push(context.partials.comment(reflection.comment));
  }

  if (reflection.typeParameters) {
    md.push(heading(4, 'Type parameters'));
    md.push(context.partials.typeParameterTable(reflection.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    md.push('context.indexSignaturePartial(typeDeclaration.indexSignature)');
  }

  if (typeDeclaration?.signatures) {
    md.push(
      heading(
        4,
        typeDeclaration.children ? 'Call signature' : 'Type declaration',
      ),
    );
    typeDeclaration.signatures.forEach((signature) => {
      md.push(context.partials.memberSignature(signature, true));
    });
  }

  if (typeDeclaration?.children) {
    md.push(heading(4, 'Type declaration'));
    md.push(context.partials.propertyTable(typeDeclaration.children));
  }

  md.push(context.partials.sources(reflection));

  return md.join('\n\n');
}
