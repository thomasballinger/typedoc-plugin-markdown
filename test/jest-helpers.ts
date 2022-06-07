require('ts-node/register');
import * as fs from 'fs';
import * as Handlebars from 'handlebars/runtime';
import * as path from 'path';
import * as tmp from 'tmp';
import {
  Application,
  PageEvent,
  ProjectReflection,
  RendererEvent,
  TSConfigReader,
  TypeDocReader,
  UrlMapping,
} from 'typedoc';
import {
  MarkdownTheme,
  MarkdownThemeRenderContext,
} from 'typedoc-plugin-markdown';

global.bootstrap = (
  entryPoints: string[],
  params: {
    stubPartials: string[];
    stubHelpers: string[];
    plugin: string[];
    options: any;
  },
) => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());
  app.bootstrap({
    logger: 'none',
    plugin: params?.plugin || [
      'typedoc-plugin-markdown',
      'typedoc-plugin-mdn-links',
    ],
    entryPoints: Array.isArray(entryPoints)
      ? entryPoints.map((inputFile: string) =>
          path.join(__dirname, './stubs/src/' + inputFile),
        )
      : [path.join(__dirname, './stubs/src/' + entryPoints)],
    tsconfig: path.join(__dirname, './stubs/tsconfig.json'),
    ...(params?.options && { ...params.options }),
  });

  const project = app.convert() as ProjectReflection;
  const outDir = tmp.dirSync();
  app.renderer.render = render;
  app.generateDocs(project, outDir.name);
  const context = (app.renderer.theme as MarkdownTheme).getRenderContext();
  context.project = project;

  params?.stubPartials?.forEach((partialName) => {
    context.Handlebars.registerPartial(
      partialName,
      `[partial: ${partialName}]`,
    );
  });

  params?.stubHelpers?.forEach((helper) => {
    context.Handlebars.registerHelper(helper, () => `[helper: ${helper}]`);
  });

  return {
    project,
    context: (app.renderer.theme as MarkdownTheme).getRenderContext(),
    outDir: outDir.name,
  };
};

global.getTemplate = (
  context: MarkdownThemeRenderContext,
  name: string,
  isPartial = true,
) => {
  if (!isPartial) {
    const templateDir = path.resolve(
      __dirname,
      '..',
      'packages',
      'typedoc-plugin-markdown',
      'dist',
      'resources',
      'templates',
    );
    const hbs = fs.readFileSync(templateDir + '/' + name + '.hbs');
    return Handlebars.compile(hbs.toString());
  }
  return Handlebars.compile(context.Handlebars.partials[name]);
};

global.renderTemplate = (
  template: Handlebars.TemplateDelegate,
  context: any,
  options = {},
) => {
  return formatContents(
    template(context, {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
      data: { options },
    }),
  );
};

global.compileHelper = (
  helper: Handlebars.HelperDelegate,
  context: any,
  args?: any,
) => {
  return formatContents(helper(context, args));
};

global.findModule = (project: ProjectReflection, name: string) => {
  return project.children?.find(
    (child) => child.name.replace(/\"/g, '') === name,
  );
};

async function render(project: ProjectReflection, outputDirectory: string) {
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
}

function formatContents(contents: string) {
  return (
    contents.replace(/[\r\n]{3,}/g, '\n\n').replace(/^\s+|\s+$/g, '') + '\n'
  );
}
