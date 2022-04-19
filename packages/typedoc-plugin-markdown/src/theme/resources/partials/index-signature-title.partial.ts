import { SignatureReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';

export function indexSignatureTitlePartial(
  context: MarkdownThemeRenderContext,
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
