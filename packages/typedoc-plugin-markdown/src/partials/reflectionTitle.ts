import { DeclarationReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars } from '../utils';

export function reflectionTitle(
  context: MarkdownThemeRenderContext,
  declarationReflection: DeclarationReflection,
  shouldEscape = true,
) {
  const out: string[] = [];
  if (
    declarationReflection?.kindString &&
    declarationReflection?.url !== declarationReflection.project.url
  ) {
    out.push(`${declarationReflection.kindString}: `);
  }
  if (declarationReflection.url === declarationReflection.project.url) {
    out.push(declarationReflection.project.name);
  } else {
    out.push(
      shouldEscape
        ? escapeChars(declarationReflection.name)
        : declarationReflection.name,
    );
    if (declarationReflection.typeParameters) {
      const typeParameters = declarationReflection.typeParameters
        .map((typeParameter) => typeParameter.name)
        .join(', ');
      out.push(`<${typeParameters}${shouldEscape ? '\\>' : '>'}`);
    }
  }
  return out.join('');
}
