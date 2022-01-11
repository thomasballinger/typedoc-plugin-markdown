import { DeclarationReflection, SignatureReflection } from 'typedoc';

import { MarkdownThemeContext } from '../..';

import { heading, link } from '../../utils/elements';

export const sourcesPartial = (
  context: MarkdownThemeContext,
  model: DeclarationReflection | SignatureReflection,
) => {
  const md: string[] = [];

  if (model.implementationOf) {
    md.push(heading(4, 'Implementation of'));
    md.push(context.typeAndParentPartial(model.implementationOf));
  }

  if (model.inheritedFrom) {
    md.push(heading(4, 'Inherited from'));
    md.push(context.typeAndParentPartial(model.inheritedFrom));
  }

  if (model.overwrites) {
    md.push(heading(4, 'Overrides'));
    md.push(context.typeAndParentPartial(model.overwrites));
  }

  if (model.sources) {
    md.push(heading(4, 'Defined in'));
    model.sources.forEach((source) => {
      if (source.url) {
        md.push(link(`${source.fileName}:${source.line}`, source.url));
      } else {
        md.push(`${source.fileName}:${source.line}`);
      }
    });
  }
  return md.join('\n\n');
};
