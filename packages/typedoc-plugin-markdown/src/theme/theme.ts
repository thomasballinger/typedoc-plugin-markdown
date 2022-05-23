import {
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  Renderer,
  RendererEvent,
  Theme,
  UrlMapping,
} from 'typedoc';
import { MarkdownThemeRenderContext } from './theme.context';
import { TemplateMapping } from './theme.model';

/**
 * Class that inherits the base TypeDoc {@link https://typedoc.org/api/classes/Theme.html Theme} Class.
 * The theme is responsible for providing context templates mappings to pages.
 */
export class MarkdownTheme extends Theme {
  private anchorMap: Record<string, string[]> = {};
  private renderContext?: MarkdownThemeRenderContext;

  /**
   * Creates a new instance of MarkdownTheme.
   * @param renderer The renderer the theme is attached to.
   */
  constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.owner, {
      [RendererEvent.BEGIN]: this.onBeginRenderer,
      [PageEvent.BEGIN]: this.onBeginPage,
    });
  }

  /**
   * Returns the associated render context.
   * @returns
   */
  getRenderContext() {
    if (!this.renderContext) {
      this.renderContext = new MarkdownThemeRenderContext(
        this,
        this.application.options,
      );
    }
    return this.renderContext;
  }

  /**
   * Abstract method that renders the provided page to a string.
   */
  render(page: PageEvent<Reflection>): string {
    return (
      (page.template(page) as string)
        .replace(/[\r\n]{3,}/g, '\n\n')
        .replace(/^\s+|\s+$/g, '') + '\n'
    );
  }

  /**
   * Abstract method used to map the models of the given project to the desired output files.
   *
   * @param project The project whose urls should be generated.
   * @returns A list of mappings defining which models should be rendered to which files.
   */
  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = [];

    const modulesFile = this.modulesFileName();

    const entryDocument = this.application.options.getValue(
      'entryDocument',
    ) as string;

    const readme = this.application.options.getValue('readme') as string;
    const noReadmeFile = readme.endsWith('none');

    if (noReadmeFile) {
      project.url = entryDocument;
      urls.push(
        new UrlMapping(entryDocument, project, this.reflectionTemplate),
      );
    } else {
      project.url = modulesFile;
      urls.push(new UrlMapping(modulesFile, project, this.reflectionTemplate));
      urls.push(new UrlMapping(entryDocument, project, this.readmeTemplate));
    }

    project.children?.forEach((child: Reflection) => {
      if (child instanceof DeclarationReflection) {
        this.buildUrls(child as DeclarationReflection, urls);
      }
    });
    console.log(
      'URLS',
      urls.map((url) => url.url),
    );
    return urls;
  }

  /**
   * Convert a given anchor to an anchor reference.
   * @param anchor
   * @returns
   */
  toAnchorRef(anchor: string) {
    return anchor;
  }

  private buildUrls(
    reflection: DeclarationReflection,
    urls: UrlMapping[],
  ): UrlMapping[] {
    const mapping = this.mappings().find((mapping) =>
      reflection.kindOf(mapping.kind),
    );
    if (mapping) {
      if (!reflection.url || !/^(http|ftp)s?:\/\//.test(reflection.url)) {
        // const url = this.getUrl(reflection, mapping.directory) + '.md';
        const url = this.toUrl(mapping, reflection);
        urls.push(new UrlMapping(url, reflection, mapping.template));
        reflection.url = url;
        reflection.hasOwnDocument = true;
      }

      for (const child of reflection.children || []) {
        if (mapping.isLeaf) {
          this.applyAnchorUrl(child, reflection);
        } else {
          this.buildUrls(child, urls);
        }
      }
    } else if (reflection.parent) {
      this.applyAnchorUrl(reflection, reflection.parent, true);
    }
    return urls;
  }

  private toUrl(mapping: any, reflection: DeclarationReflection): string {
    const modulesStructure = this.application.options.getValue(
      'modulesStructure',
    ) as boolean;

    if (modulesStructure) {
      const paths = this.getUrl(reflection);
      paths.splice(paths.length - 1, 0, mapping.directory);
      return paths.join('/') + '.md';
    }
    return mapping.directory + '/' + this.getUrl(reflection).join('.') + '.md';
  }

  private getUrl(reflection: Reflection, separator = '.') {
    let url = [reflection.getAlias()];
    if (
      reflection.parent &&
      !(reflection.parent instanceof ProjectReflection)
    ) {
      url = [...this.getUrl(reflection.parent), ...url];
    }
    return url;
  }

  private applyAnchorUrl(
    reflection: Reflection,
    container: Reflection,
    isSymbol = false,
  ) {
    const preserveAnchorCasing = this.application.options.getValue(
      'preserveAnchorCasing',
    ) as boolean;
    if (
      container.url &&
      (!reflection.url || !/^(http|ftp)s?:\/\//.test(reflection.url))
    ) {
      const reflectionId = preserveAnchorCasing
        ? reflection.name
        : reflection.name.toLowerCase();

      if (isSymbol) {
        this.anchorMap[container.url]
          ? this.anchorMap[container.url].push(reflectionId)
          : (this.anchorMap[container.url] = [reflectionId]);
      }

      const count = this.anchorMap[container.url]?.filter(
        (id) => id === reflectionId,
      )?.length;

      const anchor = this.toAnchorRef(
        reflectionId + (count > 1 ? '-' + (count - 1).toString() : ''),
      );

      reflection.url = container.url + '#' + anchor;
      reflection.anchor = anchor;
      reflection.hasOwnDocument = false;
    }
    reflection.traverse((child) => {
      if (child instanceof DeclarationReflection) {
        this.applyAnchorUrl(child, container);
      }
    });
  }
  /**
   * Maps given reflections to a template.
   * @returns A list of template mappings.
   */

  mappings(): TemplateMapping[] {
    const allReflectionsHaveOwnDocument = this.application.options.getValue(
      'allReflectionsHaveOwnDocument',
    ) as boolean;
    return [
      {
        kind: [ReflectionKind.Module],
        isLeaf: false,
        directory: 'modules',
        template: this.reflectionTemplate,
      },
      {
        kind: [ReflectionKind.Namespace],
        isLeaf: false,
        directory: 'modules',
        template: this.reflectionTemplate,
      },
      {
        kind: [ReflectionKind.Enum],
        isLeaf: false,
        directory: 'enums',
        template: this.reflectionTemplate,
      },
      {
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: 'classes',
        template: this.reflectionTemplate,
      },
      {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: 'interfaces',
        template: this.reflectionTemplate,
      },
      ...(allReflectionsHaveOwnDocument
        ? [
            {
              kind: [ReflectionKind.TypeAlias],
              isLeaf: true,
              directory: 'types',
              template: this.memberTemplate,
            },
            {
              kind: [ReflectionKind.Variable],
              isLeaf: true,
              directory: 'variables',
              template: this.memberTemplate,
            },
            {
              kind: [ReflectionKind.Function],
              isLeaf: true,
              directory: 'functions',
              template: this.memberTemplate,
            },
          ]
        : []),
    ];
  }

  protected modulesFileName = () => {
    return this.getRenderContext().modulesFileName;
  };

  protected readmeTemplate = (pageEvent: PageEvent<ProjectReflection>) => {
    return this.getRenderContext().readmeTemplate(pageEvent);
  };

  protected reflectionTemplate = (
    pageEvent: PageEvent<ProjectReflection | DeclarationReflection>,
  ) => {
    return this.getRenderContext().reflectionTemplate(pageEvent);
  };

  protected memberTemplate = (pageEvent: PageEvent<DeclarationReflection>) => {
    return this.getRenderContext().memberTemplate(pageEvent);
  };

  protected onBeginRenderer(event: RendererEvent) {
    this.getRenderContext().project = event.project;
  }

  protected onBeginPage(page: PageEvent) {
    this.getRenderContext().activeLocation = page.url;
    if (page.model instanceof DeclarationReflection) {
      this.getRenderContext().activeReflection = page.model;
    }
  }
}
