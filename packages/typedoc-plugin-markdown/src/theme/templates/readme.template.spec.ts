import { ProjectReflection } from 'typedoc';
import { readmeTemplate } from './readme.template';

describe(`Readme Template:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(['reflections.ts']);
  });

  test(`should compile readme`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    expect(readmeTemplate(global.getMockContext(), props)).toMatchSnapshot();
  });
});
