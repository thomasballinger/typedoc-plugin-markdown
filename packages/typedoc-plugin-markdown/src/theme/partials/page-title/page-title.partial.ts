import { PageEvent, ParameterReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { escapeChars } from '../../theme.utils';

export const pageTitlePartial = (
  context: MarkdownThemeRenderContext,
  props: PageEvent<any>,
  shouldEscape = true,
) => {
  const md: string[] = [''];
  if (
    props.model &&
    props.model.kindString &&
    props.url !== props.project.url
  ) {
    md.push(`${props.model.kindString} `);
  }
  if (props.url === props.project.url) {
    md.push(props.project.name);
  } else {
    md.push(shouldEscape ? escapeChars(props.model.name) : props.model.name);
    if (props.model.typeParameters) {
      const typeParameters = props.model.typeParameters
        .map((typeParameter: ParameterReflection) => typeParameter.name)
        .join(', ');
      md.push(`<${typeParameters}${shouldEscape ? '\\>' : '>'}`);
    }
  }
  return md.join('');
};
