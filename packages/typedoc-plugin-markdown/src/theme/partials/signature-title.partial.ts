import {
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';

export function signatureTitlePartial(
  context: MarkdownThemeRenderContext,
  props: SignatureReflection,
  accessor?: string,
) {
  const md: string[] = [];

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

  const getParameters = (parameters: ParameterReflection[] = []) => {
    return parameters
      .map((param) => {
        const paramsmd: string[] = [];
        if (param.flags.isRest) {
          paramsmd.push('...');
        }
        const paramItem = `\`${param.name}${
          param.flags.isOptional || param.defaultValue ? '?' : ''
        }\`: ${context.typePartial(param.type, 'all')}`;
        paramsmd.push(paramItem);
        return paramsmd.join('');
      })
      .join(', ');
  };

  md.push(`(${getParameters(props.parameters)})`);

  if (props.type && !props.parent?.kindOf(ReflectionKind.Constructor)) {
    md.push(`: ${context.typePartial(props.type, 'object')}`);
  }
  return md.join('');
}
