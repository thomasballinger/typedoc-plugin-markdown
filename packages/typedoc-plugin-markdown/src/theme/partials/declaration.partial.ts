import {
  DeclarationReflection,
  LiteralType,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { heading, MarkdownString } from '../utils/elements';
import { escapeChars, stripComments, stripLineBreaks } from '../utils/format';

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
  model: DeclarationReflection,
) => {
  const markdownString = new MarkdownString();

  const typeDeclaration = (model.type as any)
    ?.declaration as DeclarationReflection;
  if (model.comment) {
    markdownString.ln(context.commentPartial(model.comment));
  }

  if (model.typeParameters) {
    markdownString.ln(heading(4, 'Type parameters'));
    markdownString.ln(context.typeParameterTablePartial(model.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    markdownString.ln(
      context.indexSignatureTitlePartial(typeDeclaration.indexSignature),
    );
  }

  if (typeDeclaration?.signatures) {
    markdownString.ln(
      heading(
        4,
        typeDeclaration.children ? 'Call signature' : 'Type declaration',
      ),
    );
    typeDeclaration.signatures.forEach((signature) => {
      markdownString.ln(context.signaturePartial(signature, true));
    });
  }

  if (typeDeclaration?.children) {
    markdownString.ln(heading(4, 'Type declaration'));
    markdownString.ln(context.propertyTablePartial(typeDeclaration.children));
  }

  markdownString.ln(context.sourcesPartial(model));

  return markdownString.render();
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
