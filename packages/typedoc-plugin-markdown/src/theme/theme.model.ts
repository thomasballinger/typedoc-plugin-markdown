import { PageEvent, ReflectionKind, RenderTemplate } from 'typedoc';

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

export interface TemplateMapping {
  /**
   * The reflection this rule applies to.
   */
  kind: ReflectionKind[];

  /**
   * Can this mapping have children or should all further reflections be rendered
   * to the defined output page?
   */
  isLeaf: boolean;

  /**
   * The name of the directory the output files should be written to.
   */
  directory: string;

  /**
   * The name of the template that should be used to render the reflection.
   */
  template: RenderTemplate<PageEvent<any>>;
}
