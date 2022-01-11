import { Reflection } from 'typedoc';
import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';

import { TestApp } from '../test-app';

describe(`TOC:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  describe(`(default)`, () => {
    let testApp: TestApp;
    let context: MarkdownThemeContext;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap();
      context = testApp.getRenderContext();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should display toc for module'`, () => {
      expect(
        formatContents(context.tocPartial(moduleReflection as any)),
      ).toMatchSnapshot();
    });

    test(`should display toc for class'`, () => {
      expect(
        formatContents(context.tocPartial(classReflection as any)),
      ).toMatchSnapshot();
    });
  });
  describe(`(hideInPageToc)`, () => {
    let testApp: TestApp;
    let context: MarkdownThemeContext;
    beforeAll(async () => {
      testApp = new TestApp(['breadcrumbs.ts']);
      await testApp.bootstrap({ hideInPageTOC: true });
      context = testApp.getRenderContext();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    test(`should not display toc for class'`, () => {
      expect(
        formatContents(context.tocPartial(classReflection as any)).trim(),
      ).toEqual('');
    });
  });
});
