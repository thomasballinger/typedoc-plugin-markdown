const { Application, TSConfigReader } = require('typedoc');
const path = require('path');
const fs = require('fs');

/**
 * Returns project reflection from a given entry point
 * @param {*} entryPoints
 * @returns
 */
global.getProject = (entryPoint) => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    plugin: ['none'],
    entryPoints: ['./test/stubs/src/' + entryPoint],
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
  declarationPartial: (props) => '{ declaration }',
  groupsPartial: (props) => '{ groupsPartial }',
  indexSignaturePartial: (props) => '{ indexSignatureTitlePartial }',
  memberPartial: (props) => '{ memberPartial }',
  propertyTablePartial: (props) => '{ propertyTablePartial }',
  referencePartial: (props) => '{ referencePartial }',
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
