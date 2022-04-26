import { ProjectReflection } from 'typedoc';
import { propertyTablePartial } from './property-table.partial';

describe(`Property Table Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('declarations.ts');
  });

  test(`should compile property table for type literal`, () => {
    expect(
      propertyTablePartial(
        global.getMockContext(),
        (project.findReflectionByName('typeLiteralDeclaration') as any).type
          ?.declaration?.children,
      ),
    ).toMatchSnapshot();
  });
});
