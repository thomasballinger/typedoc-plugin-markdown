import { Application, TSConfigReader } from 'typedoc';

console.log('SET_ME_UP');

export const getProject = () => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    plugin: ['none'],
    entryPoints: ['./test/stubs/src/index.ts'],
    tsconfig: './test/stubs/tsconfig.json',
  });
  return app.convert();
};

export const getContext = (options: any = {}) =>
  ({
    breadcrumbsPartial: (props) => '[breadcrumbsPartial]',
    commentPartial: (props) => '[commentPartial]',
    groupsPartial: (props) => '[groupsPartial]',
    indexSignatureTitlePartial: (props) => '[indexSignatureTitlePartial]',
    reflectionPathPartial: (props) => '[reflectionPathPartial]',
    reflectionTitlePartial: (props) => '[reflectionTitlePartial]',
    signaturePartial: (props) => '[reflectionTitlePartial]',
    tocPartial: (props) => '[tocPartial]',
    typePartial: (props) => '[typePartial]',
    options,
  } as any);
