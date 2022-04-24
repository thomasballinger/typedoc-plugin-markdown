import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { declarationPartial } from './declaration.partial';

describe(`Declaration Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(['declarations.ts']);
  });

  test(`should compile a const with default value`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'stringConstWithDefaultValue',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });
});
