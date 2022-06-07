import * as Handlebars from 'handlebars/runtime';
import {
  DeclarationHierarchy,
  DeclarationReflection,
  PageEvent,
} from 'typedoc';

export const ifShowTypeHierarchy = (
  props: PageEvent<DeclarationReflection>,
  options: Handlebars.HelperOptions,
) => {
  const typeHierarchy = props.model?.typeHierarchy as DeclarationHierarchy;
  return typeHierarchy && typeHierarchy.next
    ? options.fn(props)
    : options.inverse(props);
};
