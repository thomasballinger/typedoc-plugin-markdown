import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import { HelperOptions } from '../../utils/models';

export const ifIsReference = (
  context: DeclarationReflection | ReferenceReflection,
  options: HelperOptions,
) => {
  return context instanceof ReferenceReflection
    ? options.fn(context)
    : options.inverse(context);
};
