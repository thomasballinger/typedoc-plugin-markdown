import {
  ContainerReflection,
  PageEvent,
  Reflection,
  ReflectionKind,
} from 'typedoc';
import { HelperOptions } from '../../utils/models';
const filter = [ReflectionKind.Module, ReflectionKind.Project];
export const reflectionTree = (
  context: PageEvent<ContainerReflection>,
  options: HelperOptions,
) => {
  const tree: Reflection[] = [];
  if (!filter.includes(context.model?.kind)) {
    if (context.model?.parent) {
      parseTree(context.model?.parent, tree);
    }
    tree.push(context.model);
  }
  return options.fn({ tree });
};

function parseTree(context: Reflection, tree) {
  if (!filter.includes(context?.kind)) {
    tree.push(context);
    if (context.parent) {
      parseTree(context.parent, tree);
    }
  }
}
