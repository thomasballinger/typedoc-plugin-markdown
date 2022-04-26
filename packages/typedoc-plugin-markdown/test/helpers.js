const { Application, TSConfigReader } = require('typedoc');
const path = require('path');
const fs = require('fs');

/**
 * Returns project reflection from a given entry point
 * @param {*} entryPoints
 * @returns
 */
global.getProject = (location) => {
  const app = new Application();
  const entryPoints = fs
    .readdirSync(location + '/__stubs__')
    .map((stub) => path.join(location, '__stubs__', stub));
  console.log(entryPoints);
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    plugin: ['none'],
    entryPoints,
    tsconfig: './tsconfig.test.json',
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
  indexSignaturePartial: (props) => '{ indexSignatureTitlePartial }',
  memberPartial: (props) => '{ memberPartial }',
  membersPartial: (props) => '{ membersPartial }',
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
