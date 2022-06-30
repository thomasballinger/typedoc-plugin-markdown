import * as Handlebars from 'handlebars';
import { Application, ProjectReflection } from 'typedoc';

describe(`Reflections:`, () => {
  let reflectionTemplate: Handlebars.TemplateDelegate;

  describe(`(header)`, () => {
    let app: Application;
    let project: ProjectReflection;
    beforeEach(async () => {
      const bootstrap = await global.bootstrap(['reflections.ts'], {
        hideBreadcrumbs: false,
        hidePageTitle: true,
      });
      app = bootstrap.app;
      project = bootstrap.project;
      global.stubPartials(['comment', 'member.signature', 'members']);
      global.stubHelpers(['toc', 'breadcrumbs', 'hierarchy']);
      reflectionTemplate = global.getTemplate('reflection');
    });
    test(`should compile template with breadcrumbs and without title`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.children ? project.children[0] : [],
          project: project,
        }),
      ).toMatchSnapshot();
    });
  });

  describe(`(template)`, () => {
    let app: Application;
    let project: ProjectReflection;
    beforeEach(async () => {
      const bootstrap = await global.bootstrap(['reflections.ts'], {
        hideBreadcrumbs: true,
        hidePageTitle: false,
      });
      app = bootstrap.app;
      project = bootstrap.project;
      global.stubPartials(['index', 'comment', 'member.signature', 'members']);
      global.stubHelpers(['breadcrumbs', 'hierarchy']);
      reflectionTemplate = global.getTemplate('reflection');
    });

    test(`should compile module with breadcrumbs and project title`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.children ? project.children[0] : [],
          project: project,
        }),
      ).toMatchSnapshot();
    });

    test(`should compile a callable reflection`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.getChildByName('CallableReflection'),
          project: project,
        }),
      ).toMatchSnapshot();
    });

    test(`should compile an indexable reflection`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.getChildByName('IndexableReflection'),
          project: project,
        }),
      ).toMatchSnapshot();
    });

    test(`should compile implemented class`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.getChildByName('ImplementedClass'),
          project: project,
        }),
      ).toMatchSnapshot();
    });

    test(`should compile Enum`, () => {
      expect(
        global.compileTemplate(reflectionTemplate, {
          model: project.getChildByName('EnumReflection'),
          project: project,
        }),
      ).toMatchSnapshot();
    });
  });
});
