import {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars, stripComments, stripLineBreaks } from '../utils';

export function declarationTitle(
  context: MarkdownThemeRenderContext,
  reflection: ParameterReflection | DeclarationReflection,
) {
  const md: string[] = [];

  function getType(reflection: ParameterReflection | DeclarationReflection) {
    const reflectionType = reflection.type as ReflectionType;
    if (reflectionType && reflectionType.declaration?.children) {
      return ': `Object`';
    }
    return (
      (reflection.parent?.kindOf(ReflectionKind.Enum) ? ' = ' : ': ') +
      context.partials.someType(reflectionType)
    );
  }

  if (
    reflection.flags &&
    reflection.flags.length > 0 &&
    !reflection.flags.isRest
  ) {
    md.push(' ' + reflection.flags.map((flag) => `\`${flag}\``).join(' '));
  }
  md.push(
    `${reflection.flags.isRest ? '... ' : ''} **${escapeChars(
      reflection.name,
    )}**`,
  );
  if (
    reflection instanceof DeclarationReflection &&
    reflection.typeParameters
  ) {
    md.push(
      `<${reflection.typeParameters
        ?.map((typeParameter) => `\`${typeParameter.name}\``)
        .join(', ')}\\>`,
    );
  }

  md.push(getType(reflection));

  if (
    !(reflection.type instanceof LiteralType) &&
    reflection.defaultValue &&
    reflection.defaultValue !== '...'
  ) {
    md.push(
      ` = \`${stripLineBreaks(stripComments(reflection.defaultValue))}\``,
    );
  }
  return md.join('');
}
