import * as path from 'path';
import { Application } from 'typedoc';
import { load as loadTypedocPluginMarkdown } from 'typedoc-plugin-markdown';
import { bootstrapTypedoc, removeDir } from './bootstrap';
import { loadCategoryYaml } from './category-yaml';
import { applyFrontmatter } from './front-matter';
import { getPluginOptions, getTypedocOptions } from './options';
import { PluginOptions } from './types';

// store list of plugin ids when running multiple instances
const apps: string[] = [];

export default function pluginDocusaurus(
  context: any,
  opts: Partial<PluginOptions>,
) {
  return {
    name: 'docusaurus-plugin-typedoc',
    async loadContent() {
      if (opts.id && !apps.includes(opts.id)) {
        apps.push(opts.id);

        const { siteDir } = context;

        const pluginOptions = getPluginOptions(opts);
        const typedocOptions = getTypedocOptions(opts);

        const outputDir = path.resolve(
          siteDir,
          pluginOptions.docsRoot,
          typedocOptions.out,
        );

        if (opts.cleanOutputDir) {
          removeDir(outputDir);
        }

        // Initialise and confgiure TypeDoc App
        const app = new Application();

        loadTypedocPluginMarkdown(app);

        bootstrapTypedoc(app, typedocOptions);

        applyFrontmatter(app, pluginOptions, typedocOptions);

        loadCategoryYaml(app, pluginOptions, outputDir);

        // Convert the TypeDoc app to a project reflection

        const project = app.convert();

        // If project is undefined typedoc has a problem - error logging will be supplied by typedoc.

        if (!project) {
          return;
        }

        // Generate docs

        if (pluginOptions.watch) {
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
