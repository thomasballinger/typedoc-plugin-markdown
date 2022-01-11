import { PageEvent } from 'typedoc';
import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';

import { TestApp } from '../test-app';

describe(`Reflections:`, () => {
  describe(`(header)`, () => {
    let testApp: TestApp;
    let context: MarkdownThemeContext;
    beforeEach(async () => {
      testApp = new TestApp(['reflections.ts']);

      await testApp.bootstrap({
        hideBreadcrumbs: false,
        hidePageTitle: true,
      });
      context = testApp.getRenderContext();
      jest
        .spyOn(context, 'breadcrumbsPartial')
        .mockReturnValue('[breadcrumbs]');
      jest.spyOn(context, 'tocPartial').mockReturnValue('[toc]');
      jest
        .spyOn(context, 'signatureMemberPartial')
        .mockReturnValue('[signature]');
      jest.spyOn(context, 'sourcesPartial').mockReturnValue('[sources]');
      jest.spyOn(context, 'groupsPartial').mockReturnValue('[groups]');
    });
    test(`should compile template with breadcrumbs and without title`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.project.children[0],
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });
  });

  describe(`(template)`, () => {
    let testApp: TestApp;
    let context: MarkdownThemeContext;

    beforeEach(async () => {
      testApp = new TestApp(['reflections.ts']);
      await testApp.bootstrap({
        hideBreadcrumbs: true,
        hidePageTitle: false,
      });
      context = testApp.getRenderContext();
      jest
        .spyOn(context, 'breadcrumbsPartial')
        .mockReturnValue('[breadcrumbs]');
      jest.spyOn(context, 'tocPartial').mockReturnValue('[toc]');
      jest
        .spyOn(context, 'signatureMemberPartial')
        .mockReturnValue('[signature]');
      jest.spyOn(context, 'sourcesPartial').mockReturnValue('[sources]');
      jest.spyOn(context, 'groupsPartial').mockReturnValue('[groups]');
    });

    test(`should compile module with breadcrumbs and project title`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.project.children[0],
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile a callable reflection`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.findReflection('CallableReflection'),
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile an indexable reflection`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.findReflection('IndexableReflection'),
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile implemented class`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.findReflection('ImplementedClass'),
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile Enum`, () => {
      expect(
        formatContents(
          context.reflectionTemplate({
            model: testApp.findReflection('EnumReflection'),
            project: testApp.project,
          } as any),
        ),
      ).toMatchSnapshot();
    });
  });
});
