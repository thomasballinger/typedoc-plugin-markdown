import { UnknownType } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars } from '../utils';

export function unknownType(
  context: MarkdownThemeRenderContext,
  model: UnknownType,
) {
  return escapeChars(model.name);
}
