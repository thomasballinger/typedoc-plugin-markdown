require('ts-node/register');
import { Application, Comment, ReferenceType, TSConfigReader } from 'typedoc';
import { commentPartial } from '../src/theme/partials/comment/comment.partial';
import { Collapse, typePartial } from '../src/theme/partials/type.partial';

/**
 * Returns project reflection from a given entry point
 * @param {*} entryPoints
 * @returns
 */
global.getProject = (entryPoint: string) => {
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
  commentPartial: (props: Comment) =>
    commentPartial(global.getMockContext(), props),
  declarationPartial: (props) => '{ declaration }',
  groupsPartial: (props) => '{ groupsPartial }',
  indexSignaturePartial: (props) => '{ indexSignatureTitlePartial }',
  memberPartial: (props) => '{ memberPartial }',
  parameterTablePartial: (props) => '{ parameterTablePartial }',
  propertyTablePartial: (props) => '{ propertyTablePartial }',
  referencePartial: (props) => '{ referencePartial }',
  reflectionPathPartial: (props) => '{ reflectionPathPartial }',
  reflectionTitlePartial: (props) => '{ reflectionTitlePartial }',
  signaturePartial: (props) => '{ signaturePartial }',
  signatureTitlePartial: (props) => '{ signatureTitlePartial }',
  sourcesPartial: (props) => '{ sourcesPartial }',
  typeParameterTablePartial: (props) => '{ typeParameterTablePartial }',
  tocPartial: (props) => '{ tocPartial }',
  typePartial: (props: any, collapse?: Collapse, emphasis?: boolean) =>
    typePartial(global.getMockContext(), props, collapse, emphasis),

  attemptExternalResolution: (type: ReferenceType) => type.name,
  relativeURL: (props) => '( relativeURL )',

  options: {
    entryPoints: ['index.ts'],
    entryDocument: 'README.md',
    readme: 'readme',
    ...options,
  },
});
