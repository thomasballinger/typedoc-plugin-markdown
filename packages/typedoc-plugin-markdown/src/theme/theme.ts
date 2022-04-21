import * as path from 'path';
import {
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  Renderer,
  Theme,
  UrlMapping,
} from 'typedoc';
import { formatContents } from '../utils/format';
import { MarkdownThemeRenderContext } from './theme.context';
import { TemplateMapping } from './theme.model';
import { load as loadCommentsPlugin } from './_plugins/comments';

/**
 * Class that inherits the base TypeDoc {@link https://typedoc.org/api/classes/Theme.html Theme} Class.
 * The theme is responsible for providing context templates mappings to pages.
 */
export class MarkdownTheme extends Theme {
  private location: string;
  private anchorMap: Record<string, string[]> = {};
  private renderContext?: MarkdownThemeRenderContext;

  /**
   * Regular expression used for external url matching.
   */
  static URL_PREFIX = /^(http|ftp)s?:\/\//;

  /**
   * Creates a new instance of MarkdownTheme.
   * @param renderer The renderer the theme is attached to.
   */
  constructor(renderer: Renderer) {
    super(renderer);

    loadCommentsPlugin(this.application);

    this.listenTo(this.owner, {
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
    return formatContents(page.template(page) as string);
  }

  /**
   * Abstract method used to map the models of the given project to the desired output files.
   *
   * @param project The project whose urls should be generated.
   * @returns A list of mappings defining which models should be rendered to which files.
   */
  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = [];

    const modulesFile = 'modules.md';

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

    return urls;
  }

  /**
   * Convert a given mapping and reflection to a url string.
   * @param mapping
   * @param reflection
   * @returns
   */
  toUrl(mapping: any, reflection: DeclarationReflection) {
    return mapping.directory + '/' + this.getUrl(reflection) + '.md';
  }

  /**
   * Convert a given anchor to an anchor reference.
   * @param anchor
   * @returns
   */
  toAnchorRef(anchor: string) {
    return anchor;
  }

  /**
   * Transform the given absolute url path into a relative path.
   *
   * @param url  The path to transform.
   * @returns A path relative to the document currently processed.
   */
  getRelativeUrl(url: string | undefined) {
    const publicPath = this.application.options.getValue('publicPath');
    if (!url) {
      return '';
    }

    if (MarkdownTheme.URL_PREFIX.test(url)) {
      return url;
    }

    if (publicPath) {
      return publicPath + url;
    }

    const relative = path.relative(
      path.dirname(this.location),
      path.dirname(url),
    );

    return path.join(relative, path.basename(url)).replace(/\\/g, '/');
  }

  private buildUrls(
    reflection: DeclarationReflection,
    urls: UrlMapping[],
  ): UrlMapping[] {
    const mapping = this.mappings().find((mapping) =>
      reflection.kindOf(mapping.kind),
    );
    if (mapping) {
      if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
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

  private getUrl(reflection: Reflection, relative?: Reflection): string {
    let url = reflection.getAlias();
    const filenameSeparator = this.application.options.getValue(
      'filenameSeparator',
    ) as string;

    if (
      reflection.parent &&
      reflection.parent !== relative &&
      !(reflection.parent instanceof ProjectReflection)
    ) {
      url = this.getUrl(reflection.parent, relative) + filenameSeparator + url;
    }

    return url.replace(/^_/, '');
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
      (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url))
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

  protected onBeginPage(page: PageEvent) {
    this.location = page.url;
  }
}
