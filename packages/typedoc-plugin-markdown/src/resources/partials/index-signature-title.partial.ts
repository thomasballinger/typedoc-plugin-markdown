import * as Handlebars from 'handlebars';
import { SignatureReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

export function indexSignatureTitlePartial(
  context: MarkdownThemeContext,
  props: SignatureReflection,
) {
  const md = ['▪'];
  const parameters = props.parameters
    ? props.parameters.map((parameter) => {
        return `${parameter.name}: ${Handlebars.helpers.type.call(
          parameter.type,
        )}`;
      })
    : [];
  md.push(
    `\[${parameters.join('')}\]: ${Handlebars.helpers.type.call(props.type)}`,
  );
  return md.join(' ');
}
