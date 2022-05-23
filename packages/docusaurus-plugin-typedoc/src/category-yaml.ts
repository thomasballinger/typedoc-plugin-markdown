import * as fs from 'fs';
import { Application, RendererEvent } from 'typedoc';
import { PluginOptions } from './types';

const CATEGORY_POSITION = {
  ['modules']: 1,
  ['namespaces']: 1,
  ['enums']: 2,
  ['classes']: 3,
  ['interfaces']: 4,
  ['types']: 5,
  ['functions']: 6,
  ['variables']: 7,
};

const CATEGORY_LABEL = {
  ['modules']: 'Modules',
  ['namespaces']: 'Namespaces',
  ['enums']: 'Enums',
  ['classes']: 'Classes',
  ['interfaces']: 'Interfaces',
  ['types']: 'Type Aliases',
  ['functions']: 'Functions',
  ['variables']: 'Variables',
};

export const loadCategoryYaml = (
  app: Application,
  pluginOptions: PluginOptions,
  outputDirectory: string,
) => {
  app.renderer.on(RendererEvent.END, (context: RendererEvent) => {
    writeCategoryYaml(
      outputDirectory,
      pluginOptions.sidebar.categoryLabel,
      pluginOptions.sidebar.position,
    );

    const moduleDirs = fs.readdirSync(outputDirectory);
    console.log(moduleDirs);
    moduleDirs.forEach((moduleDir) => {
      const path = outputDirectory + '/' + moduleDir;
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        console.log(moduleDir, path);
        writeCategoryYaml(
          path,
          CATEGORY_LABEL[moduleDir],
          CATEGORY_POSITION[moduleDir],
        );
        /* const folders = fs.readdirSync(path);
        // console.log(folders);
        folders.forEach((folder) => {
          // console.log(folder);
          const stats2 = fs.statSync(path + '/' + folder);
          if (stats2.isDirectory()) {
            console.log(folder);
            writeCategoryYaml(
              path + '/' + folder,
              CATEGORY_LABEL[folder],
              CATEGORY_POSITION[folder],
            );
          }
        });*/
      }
    });

    function writeCategoryYaml(
      categoryPath: string,
      label: string,
      position: number | null,
    ) {
      const yaml: string[] = [`label: "${label}"`];
      if (position !== null) {
        yaml.push(`position: ${position}`);
      }
      if (fs.existsSync(categoryPath)) {
        fs.writeFileSync(categoryPath + '/_category_.yml', yaml.join('\n'));
      }

      // Object.keys(groupUrlsByKind(this.getUrls(app.renderer.project)
    }
  });
};
