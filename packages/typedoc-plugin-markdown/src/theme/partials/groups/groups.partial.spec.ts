import { ProjectReflection } from 'typedoc';
import { groupsPartial } from './groups.partial';

describe(`Groups Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(__dirname);
  });

  test(`should compile groups with categories'`, () => {
    expect(
      groupsPartial(global.getMockContext(), project.groups),
    ).toMatchSnapshot();
  });

  test(`should compile groups without categories'`, () => {
    expect(
      groupsPartial(global.getMockContext(), project.children[0].groups),
    ).toMatchSnapshot();
  });
});
