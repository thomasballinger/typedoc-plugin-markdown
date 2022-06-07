import {
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  RenderTemplate,
  TypeDocOptionMap,
} from 'typedoc';

/**
 * An interface describing all the plugins specific options and extended TypeDoc options.
 */

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

export interface HelperOptions extends Handlebars.HelperOptions {
  data?: {
    activeLocation: string;
    activeReflection: Reflection;
    hasReadmeFile: boolean;
    globalsDocument: string;
    globalsName: string;
    project: ProjectReflection;
    options: TypedocPluginMarkdownOptions;
    relativeURL: any;
  };
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

export interface FrontMatterVars {
  [key: string]: string | number | boolean;
}
