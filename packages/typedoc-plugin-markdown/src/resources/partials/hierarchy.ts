import { DeclarationHierarchy } from 'typedoc/dist/lib/models';
import { MarkdownThemeContext } from '../..';

export const hierarchyPartial = (
  context: MarkdownThemeContext,
  props: DeclarationHierarchy,
  level: number,
) => {
  const md: string[] = [];
  const symbol = level > 0 ? getSymbol(level) : '-';
  props.types.forEach((hierarchyType) => {
    if (props.isTarget) {
      md.push(`${symbol} **\`${hierarchyType}\`**`);
    } else {
      md.push(`${symbol} ${context.typePartial(hierarchyType)}`);
    }
  });
  if (props.next) {
    md.push(context.hierarchyPartial(props.next, level + 1));
  }
  return md.join('\n\n');
};

function getSymbol(level: number) {
  return '  ' + [...Array(level)].map(() => '↳').join('');
}
