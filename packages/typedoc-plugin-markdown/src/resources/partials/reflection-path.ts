import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

export const reflectionPathPartial = (
  context: MarkdownThemeContext,
  props: DeclarationReflection | ProjectReflection,
) => {
  if (props.kind && props.kind !== ReflectionKind.Module) {
    const title: string[] = [];
    if (props.parent?.parent) {
      if (props.parent.parent?.parent) {
        title.push(
          `[${props.parent.parent.name}](${context.urlTo(
            props.parent?.parent,
          )})`,
        );
      }
      title.push(`[${props.parent.name}](${context.urlTo(props.parent)})`);
    }
    title.push(props.name);
    return title.length > 1 ? `${title.join('.')}` : '';
  }

  return '';
};
