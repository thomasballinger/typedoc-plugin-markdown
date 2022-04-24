import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { escapeChars, heading } from '../theme.utils';

export const memberPartial = (
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection | ReferenceReflection,
) => {
  const md: string[] = [];

  md.push(
    heading(
      3,
      context.options.namedAnchors
        ? `<a id="${props.anchor}" name="${props.anchor}"></a> `
        : '' + escapeChars(props.name),
    ),
  );
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
      }
      if (props instanceof DeclarationReflection) {
        md.push(context.declarationPartial(props));
      }
    }
  }
  return md.join('\n\n');
};
