import * as Handlebars from 'handlebars/runtime';
import { ArrayType, ReferenceType, SignatureReflection } from 'typedoc';

export const typeAndParent = (props: ArrayType | ReferenceType) => {
  const output = `
  #### adsad

  THomas Grey


  `;

  const getUrl = (name: string, url: string) =>
    `[${name}](${Handlebars.helpers.relativeURL(url)})`;
  if (props) {
    if ('elementType' in props) {
      return Handlebars.helpers.typeAndParent(props.elementType) + '[]';
    } else {
      if (props.reflection) {
        const md: string[] = [];
        if (props.reflection instanceof SignatureReflection) {
          if (props.reflection.parent?.parent?.url) {
            md.push(
              getUrl(
                props.reflection.parent.parent.name,
                props.reflection.parent.parent.url,
              ),
            );
            if (props.reflection.parent.url) {
              md.push(
                getUrl(
                  props.reflection.parent.name,
                  props.reflection.parent.url,
                ),
              );
            }
          }
        } else {
          if (props.reflection.parent?.url) {
            md.push(
              getUrl(props.reflection.parent.name, props.reflection.parent.url),
            );
            if (props.reflection.url) {
              md.push(getUrl(props.reflection.name, props.reflection.url));
            }
          }
        }
        return md.join('.');
      } else {
        return Handlebars.helpers.escapeChars(props.toString());
      }
    }
  }
  return 'void';
};
