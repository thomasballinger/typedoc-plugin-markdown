import * as Handlebars from 'handlebars';
import { DeclarationHierarchy } from 'typedoc/dist/lib/models';
import { MarkdownThemeContext } from '../../theme-context';
import { spaces } from '../../utils';

export function hierarchyPartial(
  context: MarkdownThemeContext,
  props: DeclarationHierarchy,
  level: number,
) {
  const md: string[] = [];
  const symbol = level > 0 ? getSymbol(level) : '-';
  props.types.forEach((hierarchyType) => {
    if (props.isTarget) {
      md.push(`${symbol} **\`${hierarchyType}\`**`);
    } else {
      md.push(`${symbol} ${Handlebars.helpers.type.call(hierarchyType)}`);
    }
  });
  if (props.next) {
    md.push(context.hierarchyPartial(props.next, level + 1));
  }
  return md.join('\n\n');
}

function getSymbol(level: number) {
  return spaces(2) + [...Array(level)].map(() => '↳').join('');
}
