import * as path from 'path';
import { Options, ReferenceType, Reflection } from 'typedoc';
import { MarkdownTheme } from '.';
import { declarationTitlePartial } from './resources/partials/declaration-title.partial';
import { declarationPartial } from './resources/partials/declaration.partial';
import { groupsPartial } from './resources/partials/groups.partial';
import { memberPartial } from './resources/partials/member.partial';
import { referencePartial } from './resources/partials/reference.partial';
import { signaturePartial } from './resources/partials/signature.partial';
import { sourcesPartial } from './resources/partials/sources.partial';
import { indexTemplate } from './resources/templates/index.template';
import { memberTemplate } from './resources/templates/member.template';
import { readmeTemplate } from './resources/templates/readme.template';
import { reflectionTemplate } from './resources/templates/reflection.template';

export interface TypedocPluginMarkdownOptions {
  hideBreadcrumbs: boolean;
  hideInPageTOC: boolean;
  hidePageTitle: boolean;
  hideMembersSymbol: boolean;
  entryDocument: string;
  entryPoints: string[];
  includes: string;
  indexTitle: string;
  media: string;
  namedAnchors: boolean;
  readme: string;
  publicPath: string;
}

export const URL_PREFIX = /^(http|ftp)s?:\/\//;

function bind<F, L extends any[], R>(fn: (f: F, ...a: L) => R, first: F) {
  return (...r: L) => fn(first, ...r);
}

export class MarkdownThemeContext {
  options: TypedocPluginMarkdownOptions;

  constructor(private theme: MarkdownTheme, options: Options) {
    this.options = options.getRawValues() as TypedocPluginMarkdownOptions;
  }

  relativeURL(url: string | undefined) {
    if (!url) {
      return;
    }
    if (URL_PREFIX.test(url)) {
      return url;
    }
    if (this.options.publicPath) {
      return this.options.publicPath + url;
    }

    const relative = path.relative(
      path.dirname(this.theme.location),
      path.dirname(url),
    );

    return path.join(relative, path.basename(url)).replace(/\\/g, '/');
  }

  urlTo = (reflection: Reflection) => this.relativeURL(reflection.url);

  reflection = () => this.theme.reflection;

  project = () => this.theme.project;

  attemptExternalResolution = (type: ReferenceType) => {
    return this.theme.owner.attemptExternalResolution(type);
  };

  globalsFile = 'modules.md';

  // templates
  indexTemplate = bind(indexTemplate, this);
  readmeTemplate = bind(readmeTemplate, this);
  reflectionTemplate = bind(reflectionTemplate, this);
  memberTemplate = bind(memberTemplate, this);

  // partials
  groupsPartial = bind(groupsPartial, this);
  memberPartial = bind(memberPartial, this);
  declarationTitlePartial = bind(declarationTitlePartial, this);
  declarationPartial = bind(declarationPartial, this);
  signaturePartial = bind(signaturePartial, this);
  referencePartial = bind(referencePartial, this);
  sourcesPartial = bind(sourcesPartial, this);
}
