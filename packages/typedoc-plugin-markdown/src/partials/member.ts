import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import { heading } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars } from '../utils';

export function member(
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection,
) {
  const md: string[] = [];

  if (context.getOption('namedAnchors')) {
    md.push(`<a id="${props.anchor}" name="${props.anchor}"></a>`);
  }

  md.push(heading(3, escapeChars(props.name)));

  if (props.signatures) {
    props.signatures.forEach((signature) => {
      md.push(context.partials.memberSignature(signature));
    });
  } else {
    if (props.hasGetterOrSetter()) {
      if (props.getSignature) {
        md.push(
          context.partials.memberSignature(props.getSignature, false, 'get'),
        );
      }
      if (props.setSignature) {
        md.push(
          context.partials.memberSignature(props.setSignature, false, 'set'),
        );
      }
    } else {
      if (props instanceof ReferenceReflection) {
        md.push(context.partials.memberReference(props));
      } else if (props instanceof DeclarationReflection) {
        md.push(context.partials.declaration(props));
      }
    }
  }
  return md.join('\n\n');
}
