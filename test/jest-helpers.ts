require('ts-node/register');
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import {
  Application,
  PageEvent,
  ProjectReflection,
  RendererEvent,
  TSConfigReader,
  TypeDocReader,
  UrlMapping,
} from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown';
import { formatContents } from 'typedoc-plugin-markdown/src/utils';

global.getTemplate = (name: string) => {
  return Handlebars.templates[name];
};

global.bootstrap = async (
  entryPoints: string[] = [],
  params: { options: any; stubPartials: string[] },
) => {
  const app = new Application();
  const options = params?.options || {};
  const stubPartials = params?.stubPartials || [];
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    logger: 'none',
    entryPoints:
      entryPoints.length > 0
        ? entryPoints.map((inputFile: string) =>
            path.join(__dirname, './stubs/src/' + inputFile),
          )
        : ['./test/stubs/src'],
    tsconfig: path.join(__dirname, 'stubs', 'tsconfig.json'),
    ...options,
    plugin: [
      ...[
        path.join(
          __dirname,
          '..',
          'packages',
          'typedoc-plugin-markdown',
          'dist',
        ),
        'typedoc-plugin-mdn-links',
      ],
      ...(options.plugin ? options.plugin : []),
    ],
  });

  const project = app.convert() as ProjectReflection;
  app.renderer.render = render;
  await app.generateDocs(project, 'docs');
  const context = (app.renderer.theme as MarkdownTheme).getRenderContext();
  stubPartials.forEach((stubPartial) => {
    context.partials[stubPartial] = () => `[partial: ${stubPartial}]`;
  });

  return { project, context };
};

global.stubPartials = (partials: string[]) => {
  partials.forEach((partial) => {
    Handlebars.registerPartial(partial, `[partial: ${partial}]`);
  });
};

global.stubHelpers = (helpers: string[]) => {
  helpers.forEach((helper) => {
    Handlebars.registerHelper(helper, () => `[helper: ${helper}]`);
  });
};

global.getPartial = (name: string) => {
  const partialDir = path.resolve(
    __dirname,
    '..',
    'packages',
    'typedoc-plugin-markdown',
    'src',
    'resources',
    'partials',
  );
  const hbs = fs.readFileSync(partialDir + '/' + name + '.handlebars');
  return Handlebars.compile(hbs.toString());
};

global.compileTemplate = (
  template: Handlebars.TemplateDelegate,
  context: any,
) => {
  return formatContents(
    template(context, {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    }),
  );
};

global.compileHelper = (
  helper: Handlebars.HelperDelegate,
  context: any,
  args?: any,
) => {
  return formatContents(helper.call(context, args));
};

global.findModule = (project: ProjectReflection, name: string) => {
  return project.children?.find(
    (child) => child.name.replace(/\"/g, '') === name,
  );
};

global.handlebarsOptionsStub = {
  fn: () => true,
  inverse: () => false,
  hash: {},
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
