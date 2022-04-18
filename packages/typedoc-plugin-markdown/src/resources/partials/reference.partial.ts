import * as Handlebars from 'handlebars';
import { ReferenceReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';

export function referencePartial(
  context: MarkdownThemeContext,
  props: ReferenceReflection,
) {
  const referenced = props.tryGetTargetReflectionDeep();

  if (!referenced) {
    return `Re-exports ${props.name}`;
  }

  if (props.name === referenced.name) {
    return `Re-exports [${referenced.name}](${Handlebars.helpers.relativeURL(
      referenced.url,
    )})`;
  }

  return `Renames and re-exports [${
    referenced.name
  }](${Handlebars.helpers.relativeURL(referenced.url)})`;
}
