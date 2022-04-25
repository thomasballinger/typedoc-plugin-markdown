import { ProjectReflection } from 'typedoc';
import { indexSignaturePartial } from './index-signature.partial';

describe(`Index Signature Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(__dirname);
  });

  test(`should compile index signature`, () => {
    expect(
      indexSignaturePartial(
        global.getMockContext(),
        (project.findReflectionByName('indexableDeclaration') as any).type
          .declaration.indexSignature,
      ),
    ).toMatchSnapshot();
  });
});
