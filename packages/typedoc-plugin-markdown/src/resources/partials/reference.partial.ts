import { ReferenceReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

export const referencePartial = (
  context: MarkdownThemeContext,
  props: ReferenceReflection,
) => {
  const referenced = props.tryGetTargetReflectionDeep();

  if (!referenced) {
    return `Re-exports ${props.name}`;
  }

  if (props.name === referenced.name) {
    return `Re-exports [${referenced.name}](${context.urlTo(referenced)})`;
  }

  return `Renames and re-exports [${referenced.name}](${context.urlTo(
    referenced,
  )})`;
};
