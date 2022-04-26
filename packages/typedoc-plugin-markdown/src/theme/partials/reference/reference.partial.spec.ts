import { ProjectReflection, ReferenceReflection } from 'typedoc';
import { referencePartial } from './reference.partial';

describe(`Reference Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('members.ts');
  });

  test(`should compile a referenced member'`, () => {
    expect(
      referencePartial(
        global.getMockContext(),
        project.findReflectionByName('ReferencedMember') as ReferenceReflection,
      ),
    ).toMatchSnapshot();
  });
});
