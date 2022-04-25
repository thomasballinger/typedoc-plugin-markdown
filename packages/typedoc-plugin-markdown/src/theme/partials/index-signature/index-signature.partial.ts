import { SignatureReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { backTicks } from '../../theme.utils';

export const indexSignaturePartial = (
  context: MarkdownThemeRenderContext,
  props: SignatureReflection,
) => {
  const parameters = props.parameters
    ? props.parameters.map((parameter) => {
        return `${backTicks(parameter.name)}: ${context.typePartial(
          parameter.type,
        )}`;
      })
    : [];
  return `\\[${parameters.join('')}\\]: ${context.typePartial(props.type)}`;
};
