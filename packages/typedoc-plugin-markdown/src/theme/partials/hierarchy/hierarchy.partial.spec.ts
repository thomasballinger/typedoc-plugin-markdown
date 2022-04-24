import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { hierarchyPartial } from './hierarchy.partial';

describe(`Hierarchy Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(__dirname);
  });

  test(`should compile type hierarchy`, () => {
    expect(
      hierarchyPartial(
        global.getMockContext(),
        (project.findReflectionByName('ParentClass') as DeclarationReflection)
          .typeHierarchy,
      ),
    ).toMatchSnapshot();
  });
});
