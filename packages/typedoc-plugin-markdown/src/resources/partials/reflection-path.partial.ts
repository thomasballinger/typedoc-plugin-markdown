import { ReflectionKind } from 'typedoc';
import { MarkdownThemeContext } from '../../theme.context';

export function reflectionPathPartial(
  context: MarkdownThemeContext,
  props: any,
) {
  if (props.model) {
    if (props.model.kind && props.model.kind !== ReflectionKind.Module) {
      const title: string[] = [];
      if (props.model.parent && props.model.parent.parent) {
        if (props.model.parent.parent.parent) {
          title.push(
            `[${props.model.parent.parent.name}](${context.relativeURL(
              props.model?.parent?.parent.url,
            )})`,
          );
        }
        title.push(
          `[${props.model.parent.name}](${context.relativeURL(
            props.model.parent.url,
          )})`,
        );
      }
      title.push(props.model.name);
      return title.length > 1 ? `${title.join('.')}` : '';
    }
  }
  return '';
}
