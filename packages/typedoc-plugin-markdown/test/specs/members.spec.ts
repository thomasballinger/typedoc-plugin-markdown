import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';

describe(`Members:`, () => {
  let membersPartial: Handlebars.TemplateDelegate;
  let memberPartial: Handlebars.TemplateDelegate;
  let project: ProjectReflection;

  describe(`(members)`, () => {
    beforeAll(async () => {
      const bootstrap = global.bootstrap('members.ts', {
        stubPartials: ['member', 'member.sources'],
      });
      project = bootstrap.project;
      membersPartial = global.getTemplate(bootstrap.context, 'members');
      memberPartial = global.getTemplate(bootstrap.context, 'member');
    });
    test(`should compile module members'`, () => {
      expect(
        global.renderTemplate(
          membersPartial,
          global.findModule(project, 'members'),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile class members'`, () => {
      expect(
        global.renderTemplate(
          membersPartial,
          project.findReflectionByName('ClassWithAccessorMembers'),
        ),
      ).toMatchSnapshot();
    });
  });

  describe(`(member)`, () => {
    beforeAll(async () => {
      const bootstrap = global.bootstrap('members.ts', {
        stubPartials: ['member.sources'],
      });
      project = bootstrap.project;
      membersPartial = global.getTemplate(bootstrap.context, 'members');
      memberPartial = global.getTemplate(bootstrap.context, 'member');
    });
    test(`should compile declaration members'`, () => {
      expect(
        global.renderTemplate(
          memberPartial,
          project.findReflectionByName('declarationMember'),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile declaration member with named anchors'`, () => {
      expect(
        global.renderTemplate(
          memberPartial,
          project.findReflectionByName('declarationMember'),
          { namedAnchors: true },
        ),
      ).toMatchSnapshot();
    });

    test(`should compile a signature members'`, () => {
      expect(
        global.renderTemplate(
          memberPartial,
          project.findReflectionByName('signatureMember'),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile members with getter'`, () => {
      expect(
        global.renderTemplate(
          memberPartial,
          (
            project.findReflectionByName('ClassWithAccessorMembers') as any
          ).findReflectionByName('getter'),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile members with setter'`, () => {
      expect(
        global.renderTemplate(
          memberPartial,
          (
            project.findReflectionByName('ClassWithAccessorMembers') as any
          ).findReflectionByName('setter'),
        ),
      ).toMatchSnapshot();
    });
  });
});
