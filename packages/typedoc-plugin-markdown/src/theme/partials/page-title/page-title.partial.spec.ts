import { ProjectReflection } from 'typedoc';
import { pageTitlePartial } from './page-title.partial';

describe(`Page Title Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('generics.ts');
  });

  test(`should compile title with type params'`, () => {
    expect(
      pageTitlePartial(global.getMockContext(), {
        project: { url: 'README.md' },
        model: project.findReflectionByName('ClassWithTypeParams'),
      } as any),
    ).toMatchSnapshot();
  });
});
