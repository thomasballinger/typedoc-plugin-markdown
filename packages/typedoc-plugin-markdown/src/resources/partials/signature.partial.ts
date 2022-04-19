import {
  DeclarationReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { heading } from '../../utils/elements';

export const signaturePartial = (
  context: MarkdownThemeContext,
  props: SignatureReflection,
  nested = false,
  accessor?: string,
) => {
  const md: string[] = [];

  const typeDeclaration = (props.type as any)
    ?.declaration as DeclarationReflection;

  md.push(context.signatureTitlePartial(props, accessor));

  if (props.comment) {
    md.push(context.commentPartial(props.comment));
  }

  if (props.typeParameters?.length) {
    md.push(heading(nested ? 5 : 4, 'Type parameters'));
    md.push(context.typeParameterTablePartial(props.typeParameters));
  }

  if (props.parameters?.length) {
    md.push(heading(nested ? 5 : 4, 'Parameters'));
    md.push(context.parameterTablePartial(props.parameters));
  }

  if (props.type && !props.parent?.kindOf(ReflectionKind.Constructor)) {
    if (props.type) {
      md.push(heading(nested ? 5 : 4, 'Returns'));
      md.push(context.typePartial(props.type, 'all'));
      if (props.comment?.returns) {
        md.push(props.comment.returns);
      }
    }

    if (typeDeclaration?.signatures) {
      typeDeclaration.signatures.forEach((signature) => {
        md.push(context.signaturePartial(signature, true));
      });
    }

    if (typeDeclaration?.children) {
      md.push(context.propertyTablePartial(typeDeclaration.children));
    }
  }

  if (!nested) {
    md.push(context.sourcesPartial(props));
  }

  return md.join('\n\n');
};
