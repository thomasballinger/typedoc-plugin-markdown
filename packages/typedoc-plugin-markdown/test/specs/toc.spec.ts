import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection, Reflection } from 'typedoc';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

describe(`TOC:`, () => {
  describe(`(default)`, () => {
    let bootstrap: {
      project: ProjectReflection;
      context: MarkdownThemeRenderContext;
    };
    let moduleReflection: Reflection;
    let classReflection: Reflection;
    let helper: Handlebars.HelperDelegate;
    beforeAll(async () => {
      bootstrap = global.bootstrap('toc.ts');
      moduleReflection = bootstrap.project;
      classReflection = bootstrap.project.findReflectionByName(
        'SomeClass',
      ) as any;
      helper = bootstrap.context.Handlebars.helpers.toc;
    });

    test(`should display toc for module'`, () => {
      expect(global.compileHelper(helper, moduleReflection)).toMatchSnapshot();
    });

    test(`should display toc for class'`, () => {
      expect(global.compileHelper(helper, classReflection)).toMatchSnapshot();
    });
  });
  describe(`(hideInPageToc)`, () => {
    let bootstrap: {
      project: ProjectReflection;
      context: MarkdownThemeRenderContext;
    };
    let moduleReflection: Reflection;
    let classReflection: Reflection;
    let helper: Handlebars.HelperDelegate;
    beforeAll(async () => {
      bootstrap = global.bootstrap('toc.ts', {
        options: { hideInPageTOC: true },
      });
      moduleReflection = bootstrap.project;
      classReflection = bootstrap.project.findReflectionByName(
        'SomeClass',
      ) as any;
      helper = bootstrap.context.Handlebars.helpers.toc;

      moduleReflection = (bootstrap.project as any).children[0];
      classReflection = (bootstrap.project as any).findReflectionByName(
        'SomeClass',
      );
    });

    test(`should not display toc for class'`, () => {
      expect(helper(classReflection)).toBeNull();
    });
  });
});
