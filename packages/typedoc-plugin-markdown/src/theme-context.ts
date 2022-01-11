import * as path from 'path';
import { Options, ReferenceType, Reflection } from 'typedoc';
import { MarkdownTheme } from '.';
import { breadcrumbsPartial } from './resources/partials/breadcrumbs';
import { commentPartial } from './resources/partials/comment';
import { commentsPartial } from './resources/partials/comments';
import { declarationMemberPartial } from './resources/partials/declaration-member';
import { declarationTitlePartial } from './resources/partials/declaration-title';
import { groupsPartial } from './resources/partials/groups';
import { hierarchyPartial } from './resources/partials/hierarchy';
import { indexSignatureTitlePartial } from './resources/partials/index-signature-title';
import { memberPartial } from './resources/partials/member';
import { parameterTablePartial } from './resources/partials/parameter-table';
import { propertyTablePartial } from './resources/partials/property-table';
import { referenceMemberPartial } from './resources/partials/reference-member';
import { reflectionPathPartial } from './resources/partials/reflection-path';
import { reflectionTitlePartial } from './resources/partials/reflection-title';
import { signatureMemberPartial } from './resources/partials/signature-member';
import { signatureTitlePartial } from './resources/partials/signature-title';
import { sourcesPartial } from './resources/partials/sources';
import { symbolPartial } from './resources/partials/symbol';
import { tocPartial } from './resources/partials/toc';
import { typePartial } from './resources/partials/type';
import { typeAndParentPartial } from './resources/partials/type-and-parent';
import { typeParameterTablePartial } from './resources/partials/type-parameter-table';
import { indexTemplate } from './resources/templates/index.template';
import { reflectionMemberTemplate } from './resources/templates/member.template';
import { readmeTemplate } from './resources/templates/readme.template';
import { reflectionTemplate } from './resources/templates/reflection.template';
import { URL_PREFIX } from './utils/constants';

export interface TypedocPluginMarkdownOptions {
  hideBreadcrumbs: boolean;
  hideInPageTOC: boolean;
  hidePageTitle: boolean;
  entryDocument: string;
  entryPoints: string[];
  includes: string;
  indexTitle: string;
  media: string;
  namedAnchors: boolean;
  readme: string;
  publicPath: string;
}

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
  reflectionMemberTemplate = bind(reflectionMemberTemplate, this);

  // partials
  breadcrumbsPartial = bind(breadcrumbsPartial, this);
  commentPartial = bind(commentPartial, this);
  commentsPartial = bind(commentsPartial, this);
  declarationMemberPartial = bind(declarationMemberPartial, this);
  signatureMemberPartial = bind(signatureMemberPartial, this);
  memberContainerPartial = bind(memberPartial, this);
  groupsPartial = bind(groupsPartial, this);
  propertyTablePartial = bind(propertyTablePartial, this);
  typeParameterTablePartial = bind(typeParameterTablePartial, this);
  parameterTablePartial = bind(parameterTablePartial, this);
  declarationTitlePartial = bind(declarationTitlePartial, this);
  hierarchyPartial = bind(hierarchyPartial, this);
  indexSignatureTitlePartial = bind(indexSignatureTitlePartial, this);
  symbolPartial = bind(symbolPartial, this);
  reflectionTitlePartial = bind(reflectionTitlePartial, this);
  referenceMemberPartial = bind(referenceMemberPartial, this);
  reflectionPathPartial = bind(reflectionPathPartial, this);
  signatureTitlePartial = bind(signatureTitlePartial, this);
  tocPartial = bind(tocPartial, this);
  typePartial = bind(typePartial, this);
  typeAndParentPartial = bind(typeAndParentPartial, this);
  sourcesPartial = bind(sourcesPartial, this);
}
