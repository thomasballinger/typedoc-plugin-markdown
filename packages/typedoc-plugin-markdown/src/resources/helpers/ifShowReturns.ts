import { HelperOptions } from 'handlebars/runtime';
import { ReflectionKind, SignatureReflection } from 'typedoc';

export const ifShowReturns = (
  props: SignatureReflection,
  options: HelperOptions,
) => {
  return props.type && !props.parent?.kindOf(ReflectionKind.Constructor)
    ? options.fn(this)
    : options.inverse(this);
};
