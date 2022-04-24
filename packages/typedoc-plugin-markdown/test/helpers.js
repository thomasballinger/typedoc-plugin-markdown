const { Application, TSConfigReader } = require('typedoc');

/**
 * Returns project reflection from a given entry point
 * @param {*} entryPoints
 * @returns
 */
global.getProject = (entryPoints) => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    plugin: ['none'],
    entryPoints: entryPoints
      ? entryPoints.map((inputFile) => './test/stubs/src/' + inputFile)
      : ['./test/stubs/src/index.ts'],
    tsconfig: './test/stubs/tsconfig.json',
  });
  return app.convert();
};

/**
 * Returns a mock context
 * @param {*} options
 * @returns
 */
global.getMockContext = (options = {}) => ({
  breadcrumbsPartial: (props) => '{ breadcrumbsPartial }',
  commentPartial: (props) => '{ commentPartial }',
  groupsPartial: (props) => '{ groupsPartial }',
  indexSignatureTitlePartial: (props) => '{ indexSignatureTitlePartial }',
  propertyTablePartial: (props) => '{ propertyTablePartial }',
  reflectionPathPartial: (props) => '{ reflectionPathPartial }',
  reflectionTitlePartial: (props) => '{ reflectionTitlePartial }',
  signaturePartial: (props) => '{ reflectionTitlePartial }',
  sourcesPartial: (props) => '{ sourcesPartial }',
  typeParameterTablePartial: (props) => '{ typeParameterTablePartial }',
  tocPartial: (props) => '{ tocPartial }',
  typePartial: (props) => '{ typePartial }',
  relativeURL: (props) => '( relativeURL )',
  options: {
    entryPoints: ['index.ts'],
    entryDocument: 'README.md',
    readme: 'readme',
    ...options,
  },
});
