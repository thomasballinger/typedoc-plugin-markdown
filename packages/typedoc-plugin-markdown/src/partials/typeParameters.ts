import { TypeParameterReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';

export function typeParameters(
  context: MarkdownThemeRenderContext,
  typeParameters: TypeParameterReflection[],
) {
  return `typeParameters`;
}
