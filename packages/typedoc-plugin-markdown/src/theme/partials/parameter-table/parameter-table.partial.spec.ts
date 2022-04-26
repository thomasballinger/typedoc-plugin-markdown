import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { parameterTablePartial } from './parameter-table.partial';

describe(`Parameter Table Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('signatures.ts');
  });

  test(`should compile table with default values'`, () => {
    expect(
      parameterTablePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithDefaults',
          ) as DeclarationReflection
        ).signatures[0].parameters,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile table with named parameters'`, () => {
    expect(
      parameterTablePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithNamedParamsAndComments',
          ) as DeclarationReflection
        ).signatures[0].parameters,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile table with nested parameters'`, () => {
    expect(
      parameterTablePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithNestedParams',
          ) as DeclarationReflection
        ).signatures[0].parameters,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile table with union type parameters'`, () => {
    expect(
      parameterTablePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithUnionTypes',
          ) as DeclarationReflection
        ).signatures[0].parameters,
      ),
    ).toMatchSnapshot();
  });
});
