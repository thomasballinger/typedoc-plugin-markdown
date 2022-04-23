import { DeclarationHierarchy } from 'typedoc/dist/lib/models';
import { MarkdownThemeRenderContext } from '../theme.context';

export function hierarchyPartial(
  context: MarkdownThemeRenderContext,
  props: DeclarationHierarchy,
) {
  let level = 0;
  const getHierarchy = (props: DeclarationHierarchy) => {
    return props.types.map((hierarchyType) => {
      level = level + 1;
      return (
        getSymbol(level) +
        (props.isTarget
          ? `**\`${hierarchyType}\`**`
          : context.typePartial(hierarchyType))
      );
    });
  };
  let md = getHierarchy(props);
  if (props.next) {
    md = [...md, ...getHierarchy(props.next)];
  }
  return md.join('\n');
}

function getSymbol(level: number) {
  return `${[...Array(level - 1)].map(() => '  ').join('')}- `;
}
