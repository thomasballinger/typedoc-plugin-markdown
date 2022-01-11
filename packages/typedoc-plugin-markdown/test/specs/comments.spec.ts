import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';
import { TestApp } from '../test-app';

describe(`Comments:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;
  beforeAll(async () => {
    testApp = new TestApp(['comments.ts']);
    await testApp.bootstrap({
      includes: './test/stubs/inc',
      media: './test/stubs/media',
    });
    context = testApp.getRenderContext();
  });

  test(`should build @link references'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentWithDocLinks').comment,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert symbols brackets to symbol links'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentsWithSymbolLinks').comment,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with fenced block'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentsWithFencedBlock').comment,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with includes'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentsWithIncludes').comment,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with tags'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentsWithTags').comment,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should allow html in comments'`, () => {
    expect(
      formatContents(
        context.commentsPartial(
          testApp.findReflection('commentsWithHTML').comment,
        ),
      ),
    ).toMatchSnapshot();
  });
});
