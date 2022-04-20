import * as path from 'path';
import * as tmp from 'tmp';
import {
  Application,
  DeclarationReflection,
  ProjectReflection,
  Renderer,
  TSConfigReader,
} from 'typedoc';
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

  constructor(entryPoints?: string[]) {
    this.app = new Application();
    this.entryPoints = entryPoints
      ? entryPoints.map((inputFile: string) =>
          path.join(__dirname, './stubs/src/' + inputFile),
        )
      : ['./test/stubs/src'];
    //load(this.app);

    //this.app.options.addReader(new TypeDocReader());
    this.app.options.addReader(new TSConfigReader());
  }

  async bootstrap(options: any = {}) {
    this.app.bootstrap({
      logger: 'none',
      entryPoints: this.entryPoints,
      tsconfig: path.join(__dirname, 'stubs', 'tsconfig.json'),
      ...options,
    });
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
    return this.project.findReflectionByName(name) as DeclarationReflection;
  }
}
