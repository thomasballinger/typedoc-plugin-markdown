import { Application, DeclarationReflection, PageEvent } from 'typedoc';
import { FrontMatterPlugin } from 'typedoc-plugin-markdown';
import { DocusaurusTheme } from '../theme';
import * as path from 'path';
import { SidebarOptions } from '../types';

export const loadFrontMatter = (app: Application) => {
  const readmeTitle = app.options.getValue('readmeTitle');
  const entryDocument = app.options.getValue('entryDocument');
  const indexSlug = app.options.getValue('indexSlug');
  const sidebar = app.options.getValue('sidebar') as SidebarOptions;
  const entryPoints = app.options.getValue('entryPoints');
  const out = app.options.getValue('out');

  FrontMatterPlugin.load(app);

  app.renderer.on(PageEvent.BEGIN, (page: PageEvent<any>) => {
    (page as any).frontmatter = getFrontMatter(page);
  });

  function getFrontMatter(page: PageEvent<DeclarationReflection>) {
    const pageId = getId(page);
    const pageTitle = getTitle(page);
    const sidebarLabel = getSidebarLabel(page);
    const sidebarPosition = getSidebarPosition(page);
    let items: any = {
      id: pageId,
      title: pageTitle,
    };
    if (page.url === entryDocument) {
      items = { ...items, slug: getSlug() };
    }
    if (sidebarLabel && sidebarLabel !== pageTitle) {
      items = { ...items, sidebar_label: sidebarLabel as string };
    }
    if (sidebarPosition) {
      items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
    }
    if (page.url === page.project.url && entryPoints.length > 1) {
      items = { ...items, hide_table_of_contents: true };
    }
    return {
      ...items,
      custom_edit_url: null,
    };
  }

  function getId(page: PageEvent) {
    return path.basename(page.url, path.extname(page.url));
  }

  function getTitle(page: PageEvent<any>) {
    if (page.url === entryDocument && page.url !== page.project.url) {
      return readmeTitle || page.project.name;
    }
    return (app.renderer.theme as DocusaurusTheme)
      ?.getRenderContext()
      .reflectionTitlePartial(page, false);
  }

  function getSlug() {
    if (indexSlug) {
      return indexSlug;
    }
    if (out === process.cwd()) {
      return '/';
    }
    return `/${path.relative(process.cwd(), out).replace(/\\/g, '/')}/`;
  }

  function getSidebarLabel(page: PageEvent<DeclarationReflection>) {
    const indexLabel =
      sidebar.indexLabel ||
      (entryPoints.length > 1 ? 'Table of contents' : 'Exports');

    if (page.url === entryDocument) {
      return page.url === page.project.url ? indexLabel : sidebar.readmeLabel;
    }

    if (page.url === 'modules.md') {
      return indexLabel;
    }

    return sidebar.fullNames ? page.model.getFullName() : page.model.name;
  }

  function getSidebarPosition(page: PageEvent<DeclarationReflection>) {
    if (page.url === entryDocument) {
      return page.url === page.project.url ? '0.5' : '0';
    }
    if (page.url === 'modules.md') {
      return '0.5';
    }
    if (page.model.getFullName().split('.').length === 1) {
      return '0';
    }
    return null;
  }
};
