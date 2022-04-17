import * as Handlebars from 'handlebars';
import { TestApp } from '../test-app';

describe(`Comments:`, () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = new TestApp(['comments.ts']);
    await testApp.bootstrap({
      includes: './test/stubs/inc',
      media: './test/stubs/media',
    });
  });

  test(`should build @link references'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentWithDocLinks').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert symbols brackets to symbol links'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentsWithSymbolLinks').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with fenced block'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentsWithFencedBlock').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with includes'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentsWithIncludes').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with tags'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentsWithTags').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should allow html in comments'`, () => {
    expect(
      Handlebars.helpers.comments(
        testApp.findReflection('commentsWithHTML').comment,
      ),
    ).toMatchSnapshot();
  });
});
