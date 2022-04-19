import { PageEvent, ParameterReflection } from 'typedoc';
import { escapeChars } from '../../../utils/format';
import { MarkdownThemeRenderContext } from '../../theme.context';

export function reflectionTitlePartial(
  context: MarkdownThemeRenderContext,
  props: PageEvent<any>,
  shouldEscape = true,
) {
  const title: string[] = [''];
  if (
    props.model &&
    props.model.kindString &&
    props.url !== props.project.url
  ) {
    title.push(`${props.model.kindString}: `);
  }
  if (props.url === props.project.url) {
    title.push(props.project.name);
  } else {
    title.push(shouldEscape ? escapeChars(props.model.name) : props.model.name);
    if (props.model.typeParameters) {
      const typeParameters = props.model.typeParameters
        .map((typeParameter: ParameterReflection) => typeParameter.name)
        .join(', ');
      title.push(`<${typeParameters}${shouldEscape ? '\\>' : '>'}`);
    }
  }
  return title.join('');
}
