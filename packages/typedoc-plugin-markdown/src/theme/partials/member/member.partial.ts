import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { escapeChars, heading } from '../../theme.utils';

export const memberPartial = (
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection | ReferenceReflection,
) => {
  const md: string[] = [];

  if (context.options.namedAnchors) {
    md.push(`<a id="${props.anchor}" name="${props.anchor}"></a>`);
  }

  md.push(heading(3, escapeChars(props.name)));

  if (props.signatures) {
    props.signatures.forEach((signature) => {
      md.push(context.signaturePartial(signature));
    });
  } else {
    if (props.hasGetterOrSetter()) {
      if (props.getSignature) {
        md.push(context.signaturePartial(props.getSignature, false, 'get'));
      }
      if (props.setSignature) {
        md.push(context.signaturePartial(props.setSignature, false, 'set'));
      }
    } else {
      if (props instanceof ReferenceReflection) {
        md.push(context.referencePartial(props));
      } else if (props instanceof DeclarationReflection) {
        md.push(context.declarationPartial(props));
      }
    }
  }
  return md.join('\n\n');
};
