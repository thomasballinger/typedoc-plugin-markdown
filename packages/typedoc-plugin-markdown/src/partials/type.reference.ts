import { ReferenceType } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme-context';
import { escapeChars } from '../utils';

export function referenceType(
  context: MarkdownThemeRenderContext,
  referenceType: ReferenceType,
  emphasis: boolean,
) {
  const externalUrl = context.attemptExternalResolution(referenceType);
  if (
    referenceType.reflection ||
    (referenceType.name && referenceType.typeArguments)
  ) {
    const reflection: string[] = [];

    if (referenceType.reflection?.url) {
      reflection.push(
        `[${`\`${referenceType.reflection.name}\``}](${context.relativeURL(
          referenceType.reflection.url,
        )})`,
      );
    } else {
      reflection.push(
        externalUrl
          ? `[${`\`${referenceType.name}\``}]( ${externalUrl} )`
          : `\`${referenceType.name}\``,
      );
    }
    if (referenceType.typeArguments && referenceType.typeArguments.length > 0) {
      reflection.push(
        `<${referenceType.typeArguments
          .map((typeArgument) => context.partials.someType(typeArgument))
          .join(', ')}\\>`,
      );
    }
    return reflection.join('');
  }
  return emphasis
    ? externalUrl
      ? `[${`\`${referenceType.name}\``}]( ${externalUrl} )`
      : `\`${referenceType.name}\``
    : escapeChars(referenceType.name);
}
