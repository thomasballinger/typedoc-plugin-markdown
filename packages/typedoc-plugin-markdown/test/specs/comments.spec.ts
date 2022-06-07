import * as Handlebars from 'handlebars/runtime';
import * as path from 'path';
import { ProjectReflection } from 'typedoc';

describe(`Comments:`, () => {
  let project: ProjectReflection;
  let template: Handlebars.TemplateDelegate;
  beforeAll(async () => {
    const bootstrap = global.bootstrap('comments.ts', {
      options: {
        includes: path.join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'test/stubs/inc',
        ),
        media: path.join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          './test/stubs/media',
        ),
      },
    });
    project = bootstrap.project;
    template = global.getTemplate(bootstrap.context, 'comment');
  });

  test(`should build @link references'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentWithDocLinks'),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert symbols brackets to symbol links'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentsWithSymbolLinks'),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with fenced block'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentsWithFencedBlock'),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with includes'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentsWithIncludes'),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with tags'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentsWithTags'),
      ),
    ).toMatchSnapshot();
  });

  test(`should allow html in comments'`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('commentsWithHTML'),
      ),
    ).toMatchSnapshot();
  });
});
