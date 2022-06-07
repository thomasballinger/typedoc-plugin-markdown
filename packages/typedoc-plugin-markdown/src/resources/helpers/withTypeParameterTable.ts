import * as Handlebars from 'handlebars/runtime';
import { TypeParameterReflection } from 'typedoc';

export const withTypeParameterTable = (
  context: TypeParameterReflection[],
  options: Handlebars.HelperOptions,
) => {
  const showTypeCol = hasTypes(context);
  const comments = context.map(
    (param) =>
      !!param.comment?.text?.trim() || !!param.comment?.shortText?.trim(),
  );
  const hasComments = !comments.every((value) => !value);

  const headers = ['Name'];

  if (showTypeCol) {
    headers.push('Type');
  }

  if (hasComments) {
    headers.push('Description');
  }

  const rows = context.map((parameter) => {
    const row: string[] = [];

    row.push(`\`${parameter.name}\``);

    if (showTypeCol) {
      const typeCol: string[] = [];
      if (!parameter.type && !parameter.default) {
        typeCol.push(`\`${parameter.name}\``);
      }
      if (parameter.type) {
        typeCol.push(
          `extends ${Handlebars.helpers.type(parameter.type, 'object')}`,
        );
      }
      if (parameter.default) {
        if (parameter.type) {
          typeCol.push(' = ');
        }
        typeCol.push(Handlebars.helpers.type(parameter.default));
      }
      row.push(typeCol.join(''));
    }

    if (hasComments) {
      if (parameter.comment) {
        row.push('Handlebars.helpers.comment(parameter.comment?.shortText)');
      } else {
        row.push('-');
      }
    }
    return row;
  });
  return options.fn({ headers, rows });
};

function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default,
  );
  return !types.every((value) => !value);
}
