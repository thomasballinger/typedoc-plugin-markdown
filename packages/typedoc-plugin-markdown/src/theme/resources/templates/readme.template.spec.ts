import { getContext, getProject } from '../../../../test/test-utils';
import { readmeTemplate } from './readme.template';

describe(`Readme Template:`, () => {
  const project = getProject();

  beforeEach(async () => {});

  test(`should compile readme`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    expect(readmeTemplate(getContext(), props)).toMatchSnapshot();
  });
});
