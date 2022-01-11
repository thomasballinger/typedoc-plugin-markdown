import { Application, ProjectReflection } from 'typedoc';
import { NavigationPlugin } from 'typedoc-plugin-markdown';
import * as fs from 'fs';

export const loadSidebar = (app: Application) => {
  NavigationPlugin.load(app);

  app.renderer.on(
    NavigationPlugin.NAVIGATION_GENERATED,
    (
      navigation: NavigationPlugin.NavigationItem,
      project: ProjectReflection,
    ) => {
      const outputDirectory = app.options.getValue('out');
      const entryDocument = app.options.getValue('entryDocument');
      const sidebarPath = outputDirectory + '/_sidebar.md';
      const parseUrl = (url: string) => url.replace(/(.*).md/, '$1');
      const navJson: string[] = [`## ${project.name}\n`];
      navigation.children?.forEach((navItem) => {
        if (navItem.isLabel) {
          navJson.push(`\n### ${navItem.title}\n`);
          navItem.children?.forEach((navItemChild) => {
            const longTitle = navItemChild.title.split('.');
            const shortTitle = longTitle[longTitle.length - 1];
            navJson.push(
              `- [${shortTitle}](${parseUrl(encodeURI(navItemChild.url))})`,
            );
          });
        } else {
          const title = navItem.url === entryDocument ? 'Home' : navItem.title;
          navJson.push(`- [${title}](${parseUrl(navItem.url)})`);
        }
      });
      fs.writeFileSync(sidebarPath, navJson.join('\n'));
      app.logger.info(`Sidebar generated at ${sidebarPath}`);
    },
  );
};
