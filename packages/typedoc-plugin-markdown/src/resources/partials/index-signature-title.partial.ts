import { SignatureReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme.context';

export function indexSignatureTitlePartial(
  context: MarkdownThemeContext,
  props: SignatureReflection,
) {
  const md = ['▪'];
  const parameters = props.parameters
    ? props.parameters.map((parameter) => {
        return `${parameter.name}: ${context.typePartial(parameter.type)}`;
      })
    : [];
  md.push(`\[${parameters.join('')}\]: ${context.typePartial(props.type)}`);
  return md.join(' ');
}
