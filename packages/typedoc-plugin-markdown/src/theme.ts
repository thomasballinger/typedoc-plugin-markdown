import {
  BindOption,
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
import { MarkdownThemeRenderContext } from './theme-context';
import { getKindPlural } from './utils/helpers';
import { TemplateMapping } from './utils/models';
import { NavigationItem } from './utils/navigation-item';

export class MarkdownTheme extends Theme {
  @BindOption('allReflectionsHaveOwnDocument')
  allReflectionsHaveOwnDocument!: boolean;
  @BindOption('entryDocument')
  entryDocument!: string;
  @BindOption('entryPoints')
  entryPoints!: string[];
  @BindOption('filenameSeparator')
  filenameSeparator!: string;
  @BindOption('readme')
  readme!: string;
  @BindOption('preserveAnchorCasing')
  preserveAnchorCasing!: boolean;

  anchorMap: Record<string, string[]> = {};

  private renderContext?: MarkdownThemeRenderContext;

  static URL_PREFIX = /^(http|ftp)s?:\/\//;

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

  render(page: PageEvent<Reflection>): string {
    return this.formatContents(page.template(page) as string);
  }

  formatContents(contents: string) {
    return contents;
    /*return (
      contents
        .replace(/[\r\n]{3,}/g, '\n\n')
        .replace(/!spaces/g, '')
        .replace(/^\s+|\s+$/g, '') + '\n'
    );*/
  }

  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = [];
    const noReadmeFile = this.readme.endsWith('none');
    if (noReadmeFile) {
      project.url = this.entryDocument;
      urls.push(
        new UrlMapping(this.entryDocument, project, this.reflectionTemplate),
      );
    } else {
      project.url = this.globalsDocument();
      urls.push(
        new UrlMapping(
          this.globalsDocument(),
          project,
          this.reflectionTemplate,
        ),
      );
      urls.push(
        new UrlMapping(this.entryDocument, project, this.readmeTemplate),
      );
    }
    project.children?.forEach((child: Reflection) => {
      if (child instanceof DeclarationReflection) {
        this.buildUrls(child as DeclarationReflection, urls);
      }
    });
    return urls;
  }

  buildUrls(
    reflection: DeclarationReflection,
    urls: UrlMapping[],
  ): UrlMapping[] {
    const mapping = this.mappings.find((mapping) =>
      reflection.kindOf(mapping.kind),
    );
    if (mapping) {
      if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
        const url = this.toUrl(reflection, mapping);
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

  toUrl(reflection: DeclarationReflection, mapping: TemplateMapping) {
    return mapping.directory + '/' + this.getUrl(reflection) + '.md';
  }

  getUrl(reflection: Reflection, relative?: Reflection): string {
    let url = reflection.getAlias();

    if (
      reflection.parent &&
      reflection.parent !== relative &&
      !(reflection.parent instanceof ProjectReflection)
    ) {
      url =
        this.getUrl(reflection.parent, relative) + this.filenameSeparator + url;
    }

    return url.replace(/^_/, '');
  }

  applyAnchorUrl(
    reflection: Reflection,
    container: Reflection,
    isSymbol = false,
  ) {
    if (
      container.url &&
      (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url))
    ) {
      const reflectionId = this.preserveAnchorCasing
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

  toAnchorRef(reflectionId: string) {
    return reflectionId;
  }

  getNavigation(project: ProjectReflection) {
    const urls = this.getUrls(project);

    const getUrlMapping = (name) => {
      if (!name) {
        return '';
      }
      return urls.find((url) => url.model.name === name);
    };

    const createNavigationItem = (
      title: string,
      url: string | undefined,
      isLabel: boolean,
      children: NavigationItem[] = [],
    ) => {
      const navigationItem = new NavigationItem(title, url);
      navigationItem.isLabel = isLabel;
      navigationItem.children = children;
      const { reflection, parent, ...filteredNavigationItem } = navigationItem;
      return filteredNavigationItem as NavigationItem;
    };
    const navigation = createNavigationItem(project.name, undefined, false);
    const hasReadme = !this.readme.endsWith('none');
    if (hasReadme) {
      navigation.children?.push(
        createNavigationItem('Readme', this.entryDocument, false),
      );
    }
    if (this.entryPoints.length === 1) {
      navigation.children?.push(
        createNavigationItem(
          'Exports',
          hasReadme ? this.globalsDocument() : this.entryDocument,
          false,
        ),
      );
    }
    this.mappings.forEach((mapping) => {
      const kind = mapping.kind[0];
      const items = project.getReflectionsByKind(kind);
      if (items.length > 0) {
        const children = items
          .map((item) =>
            createNavigationItem(
              item.getFullName(),
              (getUrlMapping(item.name) as any)?.url as string,
              true,
            ),
          )
          .sort((a, b) => (a.title > b.title ? 1 : -1));
        const group = createNavigationItem(
          getKindPlural(kind),
          undefined,
          true,
          children,
        );
        navigation.children?.push(group);
      }
    });
    return navigation;
  }

  get mappings() {
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
      ...(this.allReflectionsHaveOwnDocument
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

  protected globalsDocument = () => {
    return this.getRenderContext().globalsDocument;
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
