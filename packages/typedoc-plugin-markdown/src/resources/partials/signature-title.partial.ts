import * as Handlebars from 'handlebars';
import {
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';
import { memberSymbol } from '../../utils';

export function signatureTitlePartial(
  context: MarkdownThemeContext,
  props: SignatureReflection,
  accessor?: string,
  standalone = true,
) {
  const md: string[] = [];

  if (standalone && !context.options.hideMembersSymbol) {
    md.push(`${memberSymbol(props)} `);
  }

  if (props.parent && props.parent.flags?.length > 0) {
    md.push(props.parent.flags.map((flag) => `\`${flag}\``).join(' ') + ' ');
  }

  if (accessor) {
    md.push(`\`${accessor}\` **${props.name}**`);
  } else if (props.name !== '__call' && props.name !== '__type') {
    md.push(`**${props.name}**`);
  }

  if (props.typeParameters) {
    md.push(
      `<${props.typeParameters
        .map((typeParameter) => `\`${typeParameter.name}\``)
        .join(', ')}\\>`,
    );
  }
  md.push(`(${getParameters(props.parameters)})`);

  if (props.type && !props.parent?.kindOf(ReflectionKind.Constructor)) {
    md.push(`: ${Handlebars.helpers.type.call(props.type, 'object')}`);
  }
  return md.join('') + (standalone ? '\n' : '');
}

const getParameters = (
  parameters: ParameterReflection[] = [],
  backticks = true,
) => {
  return parameters
    .map((param) => {
      const paramsmd: string[] = [];
      if (param.flags.isRest) {
        paramsmd.push('...');
      }
      const paramItem = `${param.name}${
        param.flags.isOptional || param.defaultValue ? '?' : ''
      }`;
      paramsmd.push(backticks ? `\`${paramItem}\`` : paramItem);
      return paramsmd.join('');
    })
    .join(', ');
};
