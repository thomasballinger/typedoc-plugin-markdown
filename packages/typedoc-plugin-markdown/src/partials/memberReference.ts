import { ReferenceReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';

export function memberReference(
  context: MarkdownThemeRenderContext,
  props: ReferenceReflection,
) {
  const referenced = props.tryGetTargetReflectionDeep();

  if (!referenced) {
    return `Re-exports ${props.name}`;
  }

  if (props.name === referenced.name) {
    return `Re-exports <a href={urlTo(referenced)}>{referenced.name}</a>`;
  }

  return `Renames and re-exports <a href={urlTo(referenced)}>{referenced.name}</a>`;
}
