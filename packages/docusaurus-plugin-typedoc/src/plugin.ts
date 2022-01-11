import { LoadContext } from '@docusaurus/types';
import * as path from 'path';
import { Application } from 'typedoc';
import { load as loadTypeDocPlugin } from 'typedoc-plugin-markdown';
import { loadCategories } from './plugins/categories';
import { loadFrontMatter } from './plugins/front-matter';
import { getPluginOptions, loadTypeDocOptions } from './plugins/options';
import { removeDir, render } from './render';
import { DocusaurusTheme } from './theme';
import { PluginOptions } from './types';

// store list of plugin ids when running multiple instances
const apps: string[] = [];

export default function pluginDocusaurus(
  context: LoadContext,
  opts: Partial<PluginOptions>,
) {
  return {
    name: 'docusaurus-plugin-typedoc',
    async loadContent() {
      if (opts.id && !apps.includes(opts.id)) {
        apps.push(opts.id);

        const { siteDir } = context;

        const options = getPluginOptions(opts);

        const outputDir = path.resolve(siteDir, options.docsRoot, options.out);

        removeDir(outputDir);

        const app = new Application();

        app.renderer.defineTheme('docusaurus', DocusaurusTheme);

        app.renderer.render = render;

        loadTypeDocPlugin(app);

        loadTypeDocOptions(app);

        app.bootstrap(options);

        loadFrontMatter(app);

        loadCategories(app);

        const project = app.convert();

        // if project is undefined typedoc has a problem - error logging will be supplied by typedoc.
        if (!project) {
          return;
        }

        if (options.watch) {
          app.convertAndWatch(async (project) => {
            await app.generateDocs(project, outputDir);
          });
        } else {
          await app.generateDocs(project, outputDir);
        }
      }
    },
  };
}
