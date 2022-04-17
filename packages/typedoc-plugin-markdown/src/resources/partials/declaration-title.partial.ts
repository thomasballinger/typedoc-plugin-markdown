import * as Handlebars from 'handlebars';
import {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';
import {
  escapeChars,
  memberSymbol,
  stripComments,
  stripLineBreaks,
} from '../../utils';

export function declarationTitlePartial(
  context: MarkdownThemeContext,
  props: ParameterReflection | DeclarationReflection,
) {
  const md = context.options.hideMembersSymbol ? [] : [memberSymbol(props)];

  function getType(reflection: ParameterReflection | DeclarationReflection) {
    const reflectionType = reflection.type as ReflectionType;
    if (reflectionType && reflectionType.declaration?.children) {
      return ': `Object`';
    }
    return (
      ': ' +
      Handlebars.helpers.type.call(
        reflectionType ? reflectionType : reflection,
        'object',
      )
    );
  }

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
    md.push(getType(props));
  }

  if (
    !(props.type instanceof LiteralType) &&
    props.defaultValue &&
    props.defaultValue !== '...'
  ) {
    md.push(` = \`${stripLineBreaks(stripComments(props.defaultValue))}\``);
  }
  return md.join('');
}
