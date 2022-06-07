import * as Handlebars from 'handlebars/runtime';
import { DeclarationReflection, ReflectionType } from 'typedoc';

export const withPropertyTable = (
  context: DeclarationReflection[],
  options: Handlebars.HelperOptions,
) => {
  const comments = context.map(
    (param) =>
      !!param.comment?.text?.trim() || !!param.comment?.shortText?.trim(),
  );
  const hasComments = !comments.every((value) => !value);

  const headers = ['Name', 'Type'];

  if (hasComments) {
    headers.push('Description');
  }

  const flattenParams = (current: any) => {
    return current.type?.declaration?.children?.reduce(
      (acc: any, child: any) => {
        const childObj = {
          ...child,
          name: `${current.name}.${child.name}`,
        };
        return parseParams(childObj, acc);
      },
      [],
    );
  };

  const parseParams = (current: any, acc: any) => {
    const shouldFlatten = current.type?.declaration?.children;

    return shouldFlatten
      ? [...acc, current, ...flattenParams(current)]
      : [...acc, current];
  };

  const properties = context.reduce(
    (acc: any, current: any) => parseParams(current, acc),
    [],
  );

  const rows = properties.map((property) => {
    const propertyType = property.type ? property.type : property;
    const row: string[] = [];
    const nameCol: string[] = [];
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? Handlebars.helpers.escapeChars(getName(property))
        : `\`${getName(property)}\``;
    nameCol.push(name);
    row.push(nameCol.join(' '));
    row.push(
      Handlebars.helpers.type(propertyType).replace(/(?<!\\)\|/g, '\\|'),
    );

    if (hasComments) {
      const comments = getComments(property);

      if (comments) {
        row.push();
      } else {
        row.push('-');
      }
    }
    return row;
  });

  return options.fn({ headers, rows });
};

function getName(property: DeclarationReflection) {
  const md: string[] = [];
  if (property.flags.isRest) {
    md.push('...');
  }
  if (property.getSignature) {
    md.push(
      Handlebars.helpers.signatureTitle(property.getSignature, 'get', false),
    );
  } else if (property.setSignature) {
    md.push(
      Handlebars.helpers.signatureTitle(property.setSignature, 'set', false),
    );
  } else {
    md.push(property.name);
  }
  if (property.flags.isOptional) {
    md.push('?');
  }
  return md.join('');
}

function getComments(property: DeclarationReflection) {
  if (property.type instanceof ReflectionType) {
    if (property.type?.declaration?.signatures) {
      return property.type?.declaration.signatures[0].comment;
    }
  }
  if (property.signatures) {
    return property.signatures[0].comment;
  }
  return property.comment;
}
