import * as fs from 'fs';
import {
  Application,
  ProjectReflection,
  RendererEvent,
  TSConfigReader,
  TypeDocReader,
  UrlMapping,
} from 'typedoc';
import { DocusaurusTheme } from './theme';
import { PluginOptions } from './types';

export const bootstrapTypedoc = (app: Application, options: PluginOptions) => {
  app.renderer.defineTheme('docusaurus', DocusaurusTheme);
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());
  app.renderer.render = render;
  app.bootstrap(options);
};

export async function render(
  project: ProjectReflection,
  outputDirectory: string,
) {
  if (!this.prepareTheme()) {
    return;
  }
  const output = new RendererEvent(
    RendererEvent.BEGIN,
    outputDirectory,
    project,
  );
  output.urls = this.theme!.getUrls(project);
  this.trigger(output);
  if (!output.isDefaultPrevented) {
    output?.urls?.forEach((mapping: UrlMapping) => {
      this.renderDocument(output.createPageEvent(mapping));
    });

    this.trigger(RendererEvent.END, output);
  }
}

export function removeDir(path: string) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + '/' + filename).isDirectory()) {
          removeDir(path + '/' + filename);
        } else {
          fs.unlinkSync(path + '/' + filename);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.rmdirSync(path);
    }
  }
}
