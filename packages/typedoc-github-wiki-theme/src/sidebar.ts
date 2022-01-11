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
      const sidebarPath = outputDirectory + '/_Sidebar.md';
      const entryDocument = app.options.getValue('entryDocument');
      const parseUrl = (url: string) => '../wiki/' + url.replace('.md', '');
      const navJson: string[] = [`## ${project.name} \n`];
      const allowedSections = ['Home', 'Modules', 'Namespaces'];
      navigation.children
        ?.filter(
          (navItem) =>
            !navItem.isLabel || allowedSections.includes(navItem.title),
        )
        .forEach((navItem) => {
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
            const title =
              navItem.url === entryDocument ? 'Home' : navItem.title;
            navJson.push(`- [${title}](${parseUrl(navItem.url)})`);
          }
        });
      fs.writeFileSync(sidebarPath, navJson.join('\n') + '\n');
      app.logger.info(`Sidebar generated at ${sidebarPath}`);
    },
  );
};
