import { ProjectReflection, Reflection } from 'typedoc';
import { MarkdownThemeRenderContext } from '../../src';

describe(`Breadcrumbs:`, () => {
  describe(`(with readme)`, () => {
    let project: ProjectReflection;
    let context: MarkdownThemeRenderContext;
    let moduleReflection: Reflection;
    let classReflection: Reflection;
    beforeAll(async () => {
      const bootstrap = global.bootstrap('breadcrumbs.ts');
      project = bootstrap.project;
      context = bootstrap.context;
      moduleReflection = (project as any)?.children[0];
      classReflection = project.findReflectionByName(
        'Breadcrumbs',
      ) as Reflection;
    });

    test(`should compile README breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: project,
          url: 'README.md',
        }),
      ).toMatchSnapshot();
    });

    test(`should compile entryPoint (globals) breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: project,
          url: 'globals.md',
        }),
      ).toMatchSnapshot();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: moduleReflection,
          url: moduleReflection.url,
        }),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: classReflection,
          url: classReflection.url,
        }),
      ).toMatchSnapshot();
    });
  });
  describe(`(without readme)`, () => {
    let project: ProjectReflection;
    let context: MarkdownThemeRenderContext;
    let moduleReflection: Reflection;
    let classReflection: Reflection;
    beforeAll(async () => {
      const bootstrap = global.bootstrap('breadcrumbs.ts', {
        options: { readme: 'none' },
      });
      project = bootstrap.project;
      context = bootstrap.context;
      moduleReflection = (project as any)?.children[0];
      classReflection = project.findReflectionByName(
        'Breadcrumbs',
      ) as Reflection;
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: moduleReflection,
          url: moduleReflection.url,
        }),
      ).toMatchSnapshot();
    });
    test(`should compile class breadcrumbs'`, () => {
      expect(
        context.Handlebars.helpers.breadcrumbs({
          project: project,
          model: classReflection,
          url: classReflection.url,
        }),
      ).toMatchSnapshot();
    });
  });
});
