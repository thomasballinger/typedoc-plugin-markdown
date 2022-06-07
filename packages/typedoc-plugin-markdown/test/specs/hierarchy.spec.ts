import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';

describe(`Hierarchy:`, () => {
  let project: ProjectReflection;
  let helper: Handlebars.HelperDelegate;

  beforeAll(async () => {
    const bootstrap = global.bootstrap('hierarchy.ts');
    project = bootstrap.project;
    helper = bootstrap.context.Handlebars.helpers.hierarchy;
  });
  test(`should compile type hierarchy`, () => {
    const reflection = project.findReflectionByName('ParentClass') as any;
    expect(
      global.compileHelper(helper, reflection.typeHierarchy, 0),
    ).toMatchSnapshot();
  });

  test(`should compile nested type hierarchy`, () => {
    const reflection = project.findReflectionByName('ChildClassA') as any;
    expect(
      global.compileHelper(helper, reflection.typeHierarchy, 0),
    ).toMatchSnapshot();
  });
});
