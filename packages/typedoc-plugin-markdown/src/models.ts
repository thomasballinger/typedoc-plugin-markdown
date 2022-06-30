import { TypeDocOptionMap } from 'typedoc';

export interface TypedocPluginMarkdownOptions extends TypeDocOptionMap {
  hideBreadcrumbs: boolean;
  hideInPageTOC: boolean;
  hidePageTitle: boolean;
  hideMembersSymbol: boolean;
  entryDocument: string;
  indexTitle: string;
  namedAnchors: boolean;
  publicPath: string;
}

export type Collapse = 'object' | 'function' | 'all' | 'none';
