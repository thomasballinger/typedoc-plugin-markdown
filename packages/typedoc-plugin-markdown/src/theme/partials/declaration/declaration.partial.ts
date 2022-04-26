import {
  DeclarationReflection,
  LiteralType,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import {
  escapeChars,
  heading,
  stripComments,
  stripLineBreaks,
} from '../../theme.utils';

export const declarationPartial = (
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection,
) => {
  return [
    declarationTitle(context, props),
    declarationBody(context, props),
  ].join('\n\n');
};

const declarationTitle = (
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection,
) => {
  const md: string[] = [];

  if (props.flags && props.flags.length > 0 && !props.flags.isRest) {
    md.push(' ' + props.flags.map((flag) => `\`${flag}\``).join(' '));
  }
  md.push(`${props.flags.isRest ? '... ' : ''} **${escapeChars(props.name)}**`);
  if (props instanceof DeclarationReflection && props.typeParameters) {
    md.push(
      `<${props.typeParameters
        .map((typeParameter) => `\`${typeParameter.name}\``)
        .join(', ')}\\>`,
    );
  }

  if (!props.parent?.kindOf(ReflectionKind.Enum)) {
    md.push(getDeclarationType(context, props));
  }

  if (
    !(props.type instanceof LiteralType) &&
    props.defaultValue &&
    props.defaultValue !== '...'
  ) {
    md.push(` = \`${stripLineBreaks(stripComments(props.defaultValue))}\``);
  }
  return md.join('');
};

const declarationBody = (
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection,
) => {
  const md: string[] = [];

  const typeDeclaration = (props.type as any)
    ?.declaration as DeclarationReflection;

  if (props.comment) {
    md.push(context.commentPartial(props.comment));
  }

  if (props.typeParameters) {
    md.push(heading(4, 'Type parameters'));
    md.push(context.typeParameterTablePartial(props.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    md.push(context.indexSignaturePartial(typeDeclaration.indexSignature));
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

  md.push(context.sourcesPartial(props));

  return md.join('\n\n');
};

const getDeclarationType = (
  context: MarkdownThemeRenderContext,
  reflection: DeclarationReflection,
) => {
  const reflectionType = reflection.type as ReflectionType;
  if (reflectionType && reflectionType.declaration?.children) {
    return ': `Object`';
  }
  return (
    ': ' +
    context.typePartial(reflectionType ? reflectionType : reflection, 'object')
  );
};
