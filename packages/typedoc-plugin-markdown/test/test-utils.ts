import { Application, ProjectReflection, TSConfigReader } from 'typedoc';

console.log('SET_ME_UP');

const app = new Application();

app.options.addReader(new TSConfigReader());

app.bootstrap({
  plugin: ['none'],
  entryPoints: ['./test/stubs/src/index.ts'],
  tsconfig: './test/stubs/tsconfig.json',
});

const _project = app.convert();

const _context = {
  breadcrumbsPartial: (props) => '[breadcrumbsPartial]',
  commentPartial: (props) => '[commentPartial]',
  groupsPartial: (props) => '[groupsPartial]',
  indexSignatureTitlePartial: (props) => '[indexSignatureTitlePartial]',
  reflectionPathPartial: (props) => '[reflectionPathPartial]',
  reflectionTitlePartial: (props) => '[reflectionTitlePartial]',
  signaturePartial: (props) => '[reflectionTitlePartial]',
  tocPartial: (props) => '[tocPartial]',
  typePartial: (props) => '[typePartial]',
};

export const project = () => _project as ProjectReflection;

export const context = (options: any = {}) => ({ ..._context, options } as any);
