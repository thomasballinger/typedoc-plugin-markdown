import * as Handlebars from 'handlebars/runtime';
import { ReferenceReflection } from 'typedoc';

export const withReferenced = (
  context: ReferenceReflection,
  options: Handlebars.HelperOptions,
) => {
  const referenced = context.tryGetTargetReflectionDeep();
  return options.fn({
    ...context,
    referenced,
    renames: context.name !== referenced?.name,
  });
};
