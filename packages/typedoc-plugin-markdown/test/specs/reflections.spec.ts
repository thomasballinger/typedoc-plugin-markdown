import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';

describe(`Reflections:`, () => {
  let reflectionTemplate: Handlebars.TemplateDelegate;

  describe(`(header)`, () => {
    let project: ProjectReflection;
    beforeAll(async () => {
      const bootstrap = global.bootstrap('reflections.ts', {
        stubPartials: ['comment', 'member.signature', 'members'],
        stubHelpers: ['toc', 'breadcrumbs', 'hierarchy'],
        options: {
          hideBreadcrumbs: false,
          hidePageTitle: true,
        },
      });
      project = bootstrap.project;
      reflectionTemplate = global.getTemplate(
        bootstrap.context,
        'reflection',
        false,
      );
    });
    test(`should compile template with breadcrumbs and without title`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: (project as any).children[0],
            project: project,
          },
          {
            hideBreadcrumbs: false,
            hidePageTitle: true,
          },
        ),
      ).toMatchSnapshot();
    });
  });

  describe(`(template)`, () => {
    let project: ProjectReflection;
    const options = {
      hideBreadcrumbs: true,
      hidePageTitle: false,
    };
    beforeAll(async () => {
      const bootstrap = global.bootstrap('reflections.ts', {
        stubPartials: ['index', 'comment', 'member.signature', 'members'],
        stubHelpers: ['breadcrumbs', 'hierarchy'],
        options,
      });
      project = bootstrap.project;
      reflectionTemplate = global.getTemplate(
        bootstrap.context,
        'reflection',
        false,
      );
    });

    test(`should compile module with breadcrumbs and project title`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: (project as any).children[0],
            project: project,
          },
          options,
        ),
      ).toMatchSnapshot();
    });

    test(`should compile a callable reflection`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: project.findReflectionByName('CallableReflection'),
            project: project,
          },
          options,
        ),
      ).toMatchSnapshot();
    });

    test(`should compile an indexable reflection`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: project.findReflectionByName('IndexableReflection'),
            project: project,
          },
          options,
        ),
      ).toMatchSnapshot();
    });

    test(`should compile implemented class`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: project.findReflectionByName('ImplementedClass'),
            project: project,
          },
          options,
        ),
      ).toMatchSnapshot();
    });

    test(`should compile Enum`, () => {
      expect(
        global.renderTemplate(
          reflectionTemplate,
          {
            model: project.findReflectionByName('EnumReflection'),
            project: project,
          },
          options,
        ),
      ).toMatchSnapshot();
    });
  });
});
