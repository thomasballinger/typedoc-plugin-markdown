import * as path from 'path';

import { Application, ProjectReflection } from 'typedoc';
import { load, NavigationPlugin } from 'typedoc-plugin-markdown';
import { removeDir, render } from './render';
import { addOptions, getOptions } from './options';

import { getSidebarJson } from './sidebar';
import { PluginOptions } from './types';

let app: Application;
let project: ProjectReflection | undefined;
let sidebar: any;

export const typedocPlugin = (opts: PluginOptions, ctx: any) => {
  const options = getOptions(opts);

  return {
    name: 'vuepress-plugin-typedoc',
    async ready() {
      const outputDirectory =
        (ctx.sourceDir || ctx.dir.source()) + '/' + options.out;

      removeDir(outputDirectory);

      app = new Application();

      load(app);

      NavigationPlugin.load(app);

      addOptions(app);

      app.renderer.render = render;

      app.renderer.on(
        NavigationPlugin.NAVIGATION_GENERATED,
        (navigation: NavigationPlugin.NavigationItem) => {
          sidebar = getSidebarJson(navigation, options);
        },
      );

      app.bootstrap(options);

      project = app.convert();
      // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
      if (!project) {
        return;
      }

      if (options.watch) {
        app.convertAndWatch(async (project) => {
          await app.generateDocs(project, outputDirectory);
        });
      } else {
        await app.generateDocs(project, outputDirectory);
      }
    },
    async enhanceAppFiles() {
      if (!app || !options.sidebar) {
        return;
      }
      const sidebarJson = JSON.stringify({
        [`/${path.relative(process.cwd(), options.out)}/`]: sidebar,
      });
      return {
        name: 'typedoc-sidebar',
        content: `export default ({ siteData, options }) => {
          siteData.themeConfig.sidebarDepth = 0;
          siteData.themeConfig.sidebar = Object.assign({},siteData.themeConfig.sidebar,${sidebarJson});
        }`,
      };
    },
  };
};
