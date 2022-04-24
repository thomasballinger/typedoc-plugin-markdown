import { DeclarationReflection, ReflectionType } from 'typedoc';
import { MarkdownThemeRenderContext } from '../theme.context';
import { escapeChars, stripLineBreaks } from '../theme.utils';

export function propertyTablePartial(
  context: MarkdownThemeRenderContext,
  props: DeclarationReflection[],
) {
  const comments = props.map(
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

  const properties = props.reduce(
    (acc: any, current: any) => parseParams(current, acc),
    [],
  );

  const rows = properties.map((property) => {
    const propertyType = property.type ? property.type : property;
    const row: string[] = [];
    const nameCol: string[] = [];
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? escapeChars(getName(property))
        : `\`${getName(property)}\``;
    nameCol.push(name);
    row.push(nameCol.join(' '));
    row.push(context.typePartial(propertyType).replace(/(?<!\\)\|/g, '\\|'));

    if (hasComments) {
      const comments = getComments(property);
      if (comments) {
        row.push(
          stripLineBreaks(context.commentPartial(comments)).replace(
            /\|/g,
            '\\|',
          ),
        );
      } else {
        row.push('-');
      }
    }
    return `| ${row.join(' | ')} |\n`;
  });

  function getName(property: DeclarationReflection) {
    const md: string[] = [];
    if (property.flags.isRest) {
      md.push('...');
    }
    if (property.getSignature) {
      md.push(context.signatureTitlePartial(property.getSignature, 'get'));
    } else if (property.setSignature) {
      md.push(context.signatureTitlePartial(property.setSignature, 'set'));
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

  const output = `\n| ${headers.join(' | ')} |\n| ${headers
    .map(() => ':------')
    .join(' | ')} |\n${rows.join('')}`;

  return output;
}
