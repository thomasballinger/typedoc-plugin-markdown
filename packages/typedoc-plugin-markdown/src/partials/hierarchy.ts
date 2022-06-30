import { DeclarationHierarchy, SomeType } from 'typedoc';
import { backTicks, bold } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function hierarchy(
  context: MarkdownThemeRenderContext,
  declarationHierarchy: DeclarationHierarchy,
) {
  let level = 0;
  const getHierarchy = (props: DeclarationHierarchy) => {
    return props.types.map((hierarchyType) => {
      level = level + 1;
      return (
        getSymbol(level) +
        (props.isTarget
          ? bold(backTicks(hierarchyType.toString()))
          : context.partials.someType(hierarchyType as SomeType))
      );
    });
  };
  let md = getHierarchy(declarationHierarchy);
  if (declarationHierarchy.next) {
    md = [...md, ...getHierarchy(declarationHierarchy.next)];
  }
  return md.join('\n\n');
}

const getSymbol = (level: number) => {
  return `|--${[...Array(level - 1)].map(() => '-').join('')} `;
};
