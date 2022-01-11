import {
  Application,
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
} from 'typedoc';
import { FrontMatterPlugin } from 'typedoc-plugin-markdown';

export const loadFrontMatter = (app: Application) => {
  const indexTitle = app.options.getValue('indexTitle');
  const entryDocument = app.options.getValue('entryDocument');

  FrontMatterPlugin.load(app);

  app.renderer.on(PageEvent.BEGIN, (page: PageEvent<any>) => {
    (page as any).frontmatter = getFrontMatter(page);
  });

  function getFrontMatter(page: PageEvent<DeclarationReflection>) {
    return {
      title: getTitle(page, false),
      linkTitle: getTitle(page, true),
      slug: getSlug(page),
    };
  }

  function getTitle(page: PageEvent<ContainerReflection>, linkTitle: boolean) {
    if (page.url === entryDocument) {
      return page.url === page.project.url
        ? indexTitle || page.model.name
        : 'Readme';
    }
    if (page.url === 'modules.md' && indexTitle) {
      return indexTitle;
    }
    return linkTitle ? page.model.name : 'getPageTitle(page)';
  }

  function getSlug(page: PageEvent) {
    const slug = page.url.replace(/\.[^.$]+$/, '');
    // Only use the last part of the slug, because the folder is used to make URL
    let slugEnd = slug.split('/').pop();
    if (slugEnd === undefined) {
      slugEnd = slug;
    }
    return slugEnd;
  }
};
