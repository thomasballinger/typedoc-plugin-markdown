import * as Handlebars from 'handlebars/runtime';
import {
  DeclarationReflection,
  Options,
  PageEvent,
  ProjectReflection,
  ReferenceType,
  Reflection,
} from 'typedoc';
import { MarkdownTheme } from '.';

import { TypedocPluginMarkdownOptions } from './utils/models';

/**
 * Provides theme context for theme resources, following the theming model of TypeDoc [DefaultThemeRenderContext](https://typedoc.org/api/classes/DefaultThemeRenderContext.html).
 *
 * The context is passed into theme templates and partials:
 *
 * - [Options](#properties-options) - exposed options of the renderer.
 * - [Templates](#properties-templates) - methods that pages are mapped to.
 * - [Partials](#properties-partials) - individual elements making up a page.
 */
export class MarkdownThemeRenderContext {
  public project: ProjectReflection;
  public activeLocation: string;
  public activeReflection: DeclarationReflection;
  public globalsDocument = 'modules.md';
  public Handlebars = Handlebars.create();

  /**
   *
   * @param theme MarkdownTheme instance
   * @param options The options applied to the renderer
   */
  constructor(private theme: MarkdownTheme, public options: Options) {
    require('./resources/templates');
    require('./resources/partials');
    require('./resources/helpers');

    Handlebars.registerHelper('urlTo', (reflection: Reflection) => {
      return 'this.getRelativeURL(reflection.url)';
    });
  }

  getOption<K extends keyof TypedocPluginMarkdownOptions>(name: K) {
    return this.options.getValue(name) as TypedocPluginMarkdownOptions[K];
  }

  /**
   * The readme template, used when a readme is not available.
   * @category Templates
   */
  readmeTemplate = (props: PageEvent<ProjectReflection>) => {
    return this.getTemplate('readme-page', props);
  };

  /**
   * The reflection template, used to describe main reflections.
   * @category Templates
   */
  reflectionTemplate = (
    props: PageEvent<ProjectReflection | DeclarationReflection>,
  ) => {
    return this.getTemplate('reflection', props);
  };

  /**
   * When allReflectionsHaveOwnDocument the template used for child members.
   * @category Templates
   */
  memberTemplate = (props: PageEvent<DeclarationReflection>) => {
    return this.getTemplate('member', props);
  };

  /**
   * Returns the page title as rendered in the document h1(# title)
   * @param page
   */
  getPageTitle = (page: PageEvent) => {
    return this.Handlebars.helpers.reflectionTitle(page, false);
  };

  /**
   *
   * @param type
   * @returns Resolved externals
   * @category Utilities
   */
  attemptExternalResolution = (type: ReferenceType) => {
    return this.theme.owner.attemptExternalResolution(type);
  };

  stripComments = (str: string) => {
    return str
      .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/g, ' ')
      .replace(/\n/g, '')
      .replace(/^\s+|\s+$|(\s)+/g, '$1');
  };

  private getTemplate2(name: string, props: PageEvent<any>) {
    return this.formatContents(`
    # ${props.model.kindString}: `);
  }

  formatContents(contents: string) {
    return (
      contents
        .replace(/[\r\n]{3,}/g, '\n\n')
        .replace(/!spaces/g, '')
        .replace(/^\s+|\s+$/g, '') + '\n'
    );
  }

  private getTemplate<T>(name: string, props: T) {
    return Handlebars.templates[name](props, {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
      data: {
        activeLocation: this.activeLocation,
        activeReflection: this.activeReflection,
        hasReadmeFile: !this.getOption('readme').endsWith('none'),
        globalsDocument: this.globalsDocument,
        globalsName:
          this.getOption('entryPoints').length > 1 ? 'Modules' : 'Exports',
        project: this.project,
        options:
          this.options.getRawValues() as unknown as TypedocPluginMarkdownOptions,
      },
    });
  }
}
