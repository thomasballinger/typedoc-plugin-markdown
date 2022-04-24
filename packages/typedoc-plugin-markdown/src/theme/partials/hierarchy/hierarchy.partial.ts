import { DeclarationHierarchy } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { backTicks, bold } from '../../utils/elements';

export const hierarchyPartial = (
  context: MarkdownThemeRenderContext,
  props: DeclarationHierarchy,
) => {
  let level = 0;
  const getHierarchy = (props: DeclarationHierarchy) => {
    return props.types.map((hierarchyType) => {
      level = level + 1;
      return (
        getSymbol(level) +
        (props.isTarget
          ? bold(backTicks(hierarchyType.toString()))
          : context.typePartial(hierarchyType))
      );
    });
  };
  let md = getHierarchy(props);
  if (props.next) {
    md = [...md, ...getHierarchy(props.next)];
  }
  return md.join('\n');
};

const getSymbol = (level: number) => {
  return `${[...Array(level - 1)].map(() => '  ').join('')}- `;
};
