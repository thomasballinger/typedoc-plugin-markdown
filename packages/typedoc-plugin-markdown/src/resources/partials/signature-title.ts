import {
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeContext } from '../..';

export const signatureTitlePartial = (
  context: MarkdownThemeContext,
  props: SignatureReflection,
  accessor?: string,
  standalone = true,
) => {
  const md: string[] = [];

  if (standalone) {
    md.push(`${context.symbolPartial(props)} `);
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
    md.push(`: ${context.typePartial(props.type, 'object')}`);
  }
  return md.join('') + (standalone ? '\n' : '');
};

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
