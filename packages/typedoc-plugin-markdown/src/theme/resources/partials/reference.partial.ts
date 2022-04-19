import { ReferenceReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';

export function referencePartial(
  context: MarkdownThemeRenderContext,
  props: ReferenceReflection,
) {
  const referenced = props.tryGetTargetReflectionDeep();

  if (!referenced) {
    return `Re-exports ${props.name}`;
  }

  if (props.name === referenced.name) {
    return `Re-exports [${referenced.name}](${context.relativeURL(
      referenced.url,
    )})`;
  }

  return `Renames and re-exports [${referenced.name}](${context.relativeURL(
    referenced.url,
  )})`;
}
