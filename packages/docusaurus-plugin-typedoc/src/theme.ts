import * as fs from 'fs';
import * as path from 'path';
import {
  BindOption,
  DeclarationReflection,
  PageEvent,
  ReflectionKind,
  Renderer,
  RendererEvent,
  UrlMapping,
} from 'typedoc';
import {
  FrontMatterVars,
  getKindPlural,
  getPageTitle,
  MarkdownTheme,
  prependYAML,
} from 'typedoc-plugin-markdown';
import { FrontMatter, SidebarOptions } from './types';

const CATEGORY_POSITION = {
  [ReflectionKind.Module]: 1,
  [ReflectionKind.Namespace]: 1,
  [ReflectionKind.Enum]: 2,
  [ReflectionKind.Class]: 3,
  [ReflectionKind.Interface]: 4,
  [ReflectionKind.TypeAlias]: 5,
  [ReflectionKind.Variable]: 6,
  [ReflectionKind.Function]: 7,
  [ReflectionKind.ObjectLiteral]: 8,
};

export class DocusaurusTheme extends MarkdownTheme {
  @BindOption('sidebar')
  sidebar!: SidebarOptions;

  @BindOption('readmeTitle')
  readmeTitle!: string;

  @BindOption('indexSlug')
  indexSlug!: string;

  @BindOption('frontmatter')
  frontmatter!: FrontMatter;

  constructor(renderer: Renderer) {
    super(renderer);

    this.listenTo(this.application.renderer, {
      [PageEvent.END]: this.onPageEnd,
      [RendererEvent.END]: this.onRendererEnd,
    });
  }

  onPageEnd(page: PageEvent<DeclarationReflection>) {
    if (page.contents) {
      page.contents = prependYAML(
        page.contents,
        this.getYamlItems(page) as FrontMatterVars,
      );
    }
  }

  onRendererEnd(renderer: RendererEvent) {
    if (this.sidebar.autoConfiguration) {
      writeCategoryYaml(
        renderer.outputDirectory,
        this.sidebar.categoryLabel,
        this.sidebar.position,
      );

      Object.keys(groupUrlsByKind(this.getUrls(renderer.project))).forEach(
        (group) => {
          const kind = parseInt(group);
          const mapping = this.mappings.find((mapping) =>
            mapping.kind.includes(kind),
          );
          if (mapping) {
            writeCategoryYaml(
              renderer.outputDirectory + '/' + mapping.directory,
              getKindPlural(kind),
              CATEGORY_POSITION[kind],
            );
          }
        },
      );
    }
  }

  getYamlItems(page: PageEvent<DeclarationReflection>): FrontMatter {
    const pageId = this.getId(page);
    const pageTitle = this.getTitle(page);
    const sidebarLabel = this.getSidebarLabel(page);
    const sidebarPosition = this.getSidebarPosition(page);
    let items: FrontMatter = {
      id: pageId,
      title: pageTitle,
    };
    if (page.url === this.entryDocument && this.indexSlug) {
      items = { ...items, slug: this.indexSlug };
    }

    if (this.sidebar.autoConfiguration) {
      if (sidebarLabel && sidebarLabel !== pageTitle) {
        items = { ...items, sidebar_label: sidebarLabel as string };
      }
      if (sidebarPosition) {
        items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
      }
    }

    if (page.url === page.project.url && this.entryPoints.length > 1) {
      items = { ...items, hide_table_of_contents: true };
    }
    items = { ...items, custom_edit_url: null };
    if (this.frontmatter) {
      items = { ...items, ...this.frontmatter };
    }
    return {
      ...items,
    };
  }

  getSidebarLabel(page: PageEvent<DeclarationReflection>) {
    const indexLabel =
      this.sidebar.indexLabel ||
      (this.entryPoints.length > 1 ? 'Table of Contents' : 'Exports');

    if (page.url === this.entryDocument) {
      return page.url === page.project.url
        ? indexLabel
        : this.sidebar.readmeLabel;
    }

    if (page.url === this.getRenderContext().globalsFile) {
      return indexLabel;
    }

    return this.sidebar.fullNames ? page.model.getFullName() : page.model.name;
  }

  getSidebarPosition(page: PageEvent<DeclarationReflection>) {
    if (page.url === this.entryDocument) {
      return page.url === page.project.url ? '0.5' : '0';
    }
    if (page.url === this.getRenderContext().globalsFile) {
      return '0.5';
    }
    if (page.model.getFullName().split('.').length === 1) {
      return '0';
    }
    return null;
  }

  getId(page: PageEvent) {
    return path.basename(page.url, path.extname(page.url));
  }

  getTitle(page: PageEvent) {
    const readmeTitle = this.readmeTitle || page.project.name;
    if (page.url === this.entryDocument && page.url !== page.project.url) {
      return readmeTitle;
    }
    return getPageTitle(page);
  }

  get mappings() {
    return super.mappings.map((mapping) => {
      if (mapping.kind.includes(ReflectionKind.Namespace)) {
        return {
          ...mapping,
          directory: 'namespaces',
        };
      }
      return mapping;
    });
  }
}

const writeCategoryYaml = (
  categoryPath: string,
  label: string,
  position: number | null,
) => {
  const yaml: string[] = [`label: "${label}"`];
  if (position !== null) {
    yaml.push(`position: ${position}`);
  }
  if (fs.existsSync(categoryPath)) {
    fs.writeFileSync(categoryPath + '/_category_.yml', yaml.join('\n'));
  }
};

const groupUrlsByKind = (urls: UrlMapping[]) => {
  return urls.reduce(
    (r, v, i, a, k = v.model.kind) => ((r[k] || (r[k] = [])).push(v), r),
    {},
  );
};
