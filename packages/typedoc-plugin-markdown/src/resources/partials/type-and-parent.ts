import { ArrayType, ReferenceType, SignatureReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../theme-context';
import { escapeChars } from '../../utils/format';

export const typeAndParentPartial = (
  context: MarkdownThemeContext,
  props: ArrayType | ReferenceType,
) => {
  const getUrl = (name: string, url: string) =>
    `[${name}](${context.relativeURL(url)})`;
  if (props) {
    if ('elementType' in props) {
      return context.typeAndParentPartial(props.elementType) + '[]';
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
        return escapeChars(props.toString());
      }
    }
  }
  return 'void';
};
