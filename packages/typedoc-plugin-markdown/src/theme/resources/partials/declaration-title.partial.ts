import {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import {
  escapeChars,
  stripComments,
  stripLineBreaks,
} from '../../../utils/format';
import { MarkdownThemeRenderContext } from '../../theme.context';

export function declarationTitlePartial(
  context: MarkdownThemeRenderContext,
  props: ParameterReflection | DeclarationReflection,
) {
  const md: string[] = [];

  function getType(reflection: ParameterReflection | DeclarationReflection) {
    const reflectionType = reflection.type as ReflectionType;
    if (reflectionType && reflectionType.declaration?.children) {
      return ': `Object`';
    }
    return (
      ': ' +
      context.typePartial(
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
