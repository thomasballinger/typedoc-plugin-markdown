import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import { MarkdownThemeContext } from '../..';
import { escapeChars } from '../../utils/format';
import { heading } from '../../utils/elements';

export const memberPartial = (
  context: MarkdownThemeContext,
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
      md.push(context.signatureMemberPartial(signature));
    });
  } else {
    if (props.hasGetterOrSetter()) {
      if (props.getSignature) {
        md.push(
          context.signatureMemberPartial(props.getSignature, false, 'get'),
        );
      }
      if (props.setSignature) {
        md.push(
          context.signatureMemberPartial(props.setSignature, false, 'set'),
        );
      }
    } else {
      if (props instanceof ReferenceReflection) {
        md.push(context.referenceMemberPartial(props));
      }
      if (props instanceof DeclarationReflection) {
        md.push(context.declarationMemberPartial(props));
      }
    }
  }
  return md.join('\n\n');
};
