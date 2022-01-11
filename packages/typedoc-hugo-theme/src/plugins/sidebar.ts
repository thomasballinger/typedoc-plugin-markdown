import { Application, ReflectionKind } from 'typedoc';
import { MarkdownTheme, NavigationPlugin } from 'typedoc-plugin-markdown';
import * as fs from 'fs';

export const loadSidebar = (app: Application) => {
  NavigationPlugin.load(app);

  app.renderer.on(
    NavigationPlugin.NAVIGATION_GENERATED,
    (navigation: NavigationPlugin.NavigationItem) => {
      const outputDirectory = app.options.getValue('out');
      if (navigation.children) {
        navigation.children
          // filter navigation group items
          .filter((navItem) => navItem.isLabel)
          .forEach((navItem) => {
            // get the mapping so we know what dir to write to
            const mapping = (app.renderer.theme as MarkdownTheme)
              ?.mappings()
              .find((mapping) =>
                mapping.kind.some(
                  (kind: ReflectionKind) =>
                    NavigationPlugin.getKindPlural(kind) === navItem.title,
                ),
              );
            if (mapping) {
              fs.writeFileSync(
                outputDirectory + '/' + mapping.directory + '/_index.md',
                ['---', `title: "${navItem.title}"`, '---'].join('\n'),
              );
            }
          });
      }
    },
  );
};
