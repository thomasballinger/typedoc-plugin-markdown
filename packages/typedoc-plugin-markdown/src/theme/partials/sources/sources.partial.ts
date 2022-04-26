import {
  ArrayType,
  DeclarationReflection,
  ReferenceType,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { escapeChars, heading, link } from '../../theme.utils';

export const sourcesPartial = (
  context: MarkdownThemeRenderContext,
  model: DeclarationReflection | SignatureReflection,
) => {
  const md: string[] = [];

  if (model.implementationOf) {
    md.push(heading(4, 'Implementation of'));
    md.push(typeAndParent(context, model.implementationOf));
  }

  if (model.inheritedFrom) {
    md.push(heading(4, 'Inherited from'));
    md.push(typeAndParent(context, model.inheritedFrom));
  }

  if (model.overwrites) {
    md.push(heading(4, 'Overrides'));
    md.push(typeAndParent(context, model.overwrites));
  }

  if (model.sources) {
    md.push(heading(4, 'Defined in'));
    model.sources.forEach((source) => {
      if (source.url) {
        md.push(
          link(`${escapeChars(source.fileName)}:${source.line}`, source.url),
        );
      } else {
        md.push(`${escapeChars(source.fileName)}:${source.line}`);
      }
    });
  }
  return md.join('\n\n');
};

const typeAndParent = (
  context: MarkdownThemeRenderContext,
  props: ArrayType | ReferenceType,
) => {
  const getUrl = (name: string, url: string) =>
    `[${name}](${context.relativeURL(url)})`;
  if (props) {
    if ('elementType' in props) {
      return typeAndParent(context, props.elementType as any) + '[]';
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
        return md.length > 0 ? md.join('.') : props.name;
      } else {
        return escapeChars(props.toString());
      }
    }
  }
  return 'void';
};
