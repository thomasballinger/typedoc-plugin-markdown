import { Reflection } from 'typedoc';
import { MarkdownThemeContext } from '../../src';
import { TestApp } from '../test-app';

describe(`Breadcrumbs:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  describe(`(with readme)`, () => {
    let testApp: TestApp;
    let context: MarkdownThemeContext;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap();
      context = testApp.getRenderContext();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should compile README breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: testApp.project,
          url: 'README.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile entryPoint (globals) breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: testApp.project,
          url: 'globals.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: moduleReflection,
          url: moduleReflection.url,
        } as any),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: classReflection,
          url: classReflection.url,
        } as any),
      ).toMatchSnapshot();
    });
  });
  describe(`(without readme)`, () => {
    let testApp: TestApp;
    let context;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap({ readme: 'none' });
      context = testApp.getRenderContext();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: moduleReflection,
          url: moduleReflection.url,
        } as any),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        context.breadcrumbsPartial({
          project: testApp.project,
          model: classReflection,
          url: classReflection.url,
        } as any),
      ).toMatchSnapshot();
    });
  });
});
