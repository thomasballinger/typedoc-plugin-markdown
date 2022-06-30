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
import { URL_PREFIX } from './constants';
import { MarkdownThemeRenderContext } from './theme-context';
import { formatContents } from './utils';

export class MarkdownTheme extends Theme {
  @BindOption('allReflectionsHaveOwnDocument')
  allReflectionsHaveOwnDocument!: boolean;
  @BindOption('entryDocument') entryDocument!: string;
  @BindOption('entryPoints') entryPoints!: string[];
  @BindOption('filenameSeparator') filenameSeparator!: string;
  @BindOption('readme') readme!: string;
  @BindOption('preserveAnchorCasing') preserveAnchorCasing!: boolean;

  private _renderContext?: MarkdownThemeRenderContext;
  private anchorMap: Record<string, string[]> = {};

  constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.owner, {
      [RendererEvent.BEGIN]: this.onBeginRenderer,
      [PageEvent.BEGIN]: this.onBeginPage,
    });
  }

  getRenderContext() {
    if (!this._renderContext) {
      this._renderContext = new MarkdownThemeRenderContext(
        this,
        this.application.options,
      );
    }
    return this._renderContext;
  }

  readmeTemplate = (pageEvent: PageEvent<ProjectReflection>) => {
    return this.getRenderContext().templates.readme(pageEvent);
  };

  projectTemplate = (pageEvent: PageEvent<ProjectReflection>) => {
    return this.getRenderContext().templates.project(pageEvent);
  };

  reflectionTemplate = (pageEvent: PageEvent<DeclarationReflection>) => {
    return this.getRenderContext().templates.reflection(pageEvent);
  };

  render(page: PageEvent<Reflection>): string {
    return formatContents(page.template(page) as string);
  }

  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = [];
    const noReadmeFile = this.readme.endsWith('none');
    if (noReadmeFile) {
      project.url = this.entryDocument;
      urls.push(
        new UrlMapping(this.entryDocument, project, this.projectTemplate),
      );
    } else {
      project.url = this.getRenderContext().globalsFile;
      urls.push(
        new UrlMapping(
          this.getRenderContext().globalsFile,
          project,
          this.projectTemplate,
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
      if (!reflection.url || !URL_PREFIX.test(reflection.url)) {
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

  toUrl(mapping: any, reflection: DeclarationReflection) {
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
      (!reflection.url || !URL_PREFIX.test(reflection.url))
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
              template: this.reflectionTemplate,
            },
            {
              kind: [ReflectionKind.Variable],
              isLeaf: true,
              directory: 'variables',
              template: this.reflectionTemplate,
            },
            {
              kind: [ReflectionKind.Function],
              isLeaf: true,
              directory: 'functions',
              template: this.reflectionTemplate,
            },
          ]
        : []),
    ];
  }

  protected onBeginRenderer(event: RendererEvent) {
    //this.getRenderContext().project = event.project;
  }

  protected onBeginPage(page: PageEvent) {
    this.getRenderContext().activeLocation = page.url;
  }
}
