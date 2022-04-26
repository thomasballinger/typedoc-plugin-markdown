import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../..';
import { memberPartial } from './member.partial';

describe(`Member Partial:`, () => {
  let project: ProjectReflection;
  let context: MarkdownThemeRenderContext;

  beforeAll(async () => {
    project = global.getProject('members.ts');
  });

  test(`should compile declaration member'`, () => {
    expect(
      memberPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'declarationMember',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a signature member'`, () => {
    expect(
      memberPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'signatureMember',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a referenced member'`, () => {
    expect(
      memberPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'ReferencedMember',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile members with getter'`, () => {
    expect(
      memberPartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'ClassWithAccessorMembers',
          ) as DeclarationReflection
        ).findReflectionByName('getter') as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile members with setter'`, () => {
    expect(
      memberPartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'ClassWithAccessorMembers',
          ) as DeclarationReflection
        ).findReflectionByName('setter') as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should set named anchors'`, () => {
    expect(
      memberPartial(
        global.getMockContext({ namedAnchors: true }),
        project.findReflectionByName(
          'declarationMember',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });
});
