import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { typeParameterTablePartial } from './type-parameter-table.partial';

describe(`typeParameterTablePartial`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('generics.ts');
  });

  test(`should compile type parameter table`, () => {
    expect(
      typeParameterTablePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithTypeParams',
          ) as DeclarationReflection
        )?.signatures[0].typeParameters,
      ),
    ).toMatchSnapshot();
  });
});
