import * as path from 'path';

import * as tmp from 'tmp';
import {
  Application,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  Renderer,
  RendererEvent,
  SignatureReflection,
  TSConfigReader,
  TypeDocReader,
  UrlMapping,
} from 'typedoc';

import { load } from '../src/index';
import { MarkdownTheme } from '../src/theme';

tmp.setGracefulCleanup();

export class TestApp {
  app: Application;
  project: ProjectReflection;
  renderer: Renderer;
  theme: MarkdownTheme;
  outDir: string;
  tmpobj: tmp.DirResult;
  entryPoints: string[];

  static getExpectedUrls(urlMappings: UrlMapping[]) {
    const expectedUrls = [];
    urlMappings.forEach((urlMapping) => {
      expectedUrls.push(urlMapping.url);
      if (urlMapping.model.children) {
        urlMapping.model.children.forEach((reflection) => {
          if (!reflection.hasOwnDocument) {
            expectedUrls.push(reflection.url);
          }
        });
      }
    });
    return expectedUrls;
  }

  constructor(entryPoints?: string[]) {
    this.app = new Application();
    this.entryPoints = entryPoints
      ? entryPoints.map((inputFile: string) =>
          path.join(__dirname, './stubs/src/' + inputFile),
        )
      : ['./test/stubs/src'];
    //load(this.app);

    this.app.options.addReader(new TypeDocReader());
    this.app.options.addReader(new TSConfigReader());
  }

  async bootstrap(options: any = {}) {
    this.app.bootstrap({
      logger: 'none',
      entryPoints: this.entryPoints,
      tsconfig: path.join(__dirname, 'stubs', 'tsconfig.json'),
      ...options,
    });

    this.project = this.app.convert();
    this.renderer = this.app.renderer;
    this.tmpobj = tmp.dirSync();

    this.app.renderer.render = render;
    await this.app.generateDocs(this.project, this.tmpobj.name);
    this.theme = this.app.renderer.theme as MarkdownTheme;
  }

  getRenderContext() {
    return this.theme.getRenderContext();
  }

  findModule(name: string) {
    return this.project.children.find(
      (child) => child.name.replace(/\"/g, '') === name,
    );
  }

  findEntryPoint() {
    return this.project;
  }

  findReflection(name: string) {
    return this.project.findReflectionByName(name) as any;
  }
}

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
      const page = output.createPageEvent(mapping);
      this.trigger(PageEvent.BEGIN, page);
      this.trigger(PageEvent.END, page);
    });
    this.trigger(RendererEvent.END, output);
  }
  this.theme = void 0;
}
