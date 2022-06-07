import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';
let project: ProjectReflection;

describe(`Readme:`, () => {
  let readmeTemplate: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    const bootstrap = global.bootstrap('reflections.ts', {
      stubHelpers: ['breadcrumbs'],
    });
    project = bootstrap.project;
    readmeTemplate = global.getTemplate(bootstrap.context, 'readme', false);
  });

  test(`should compile readme`, () => {
    expect(
      global.renderTemplate(readmeTemplate, {
        model: project,
        project: project,
      }),
    ).toMatchSnapshot();
  });
});
