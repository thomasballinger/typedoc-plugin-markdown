import { ProjectReflection } from 'typedoc';
import { commentPartial } from './comment.partial';

describe(`Comment Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(__dirname);
  });

  test(`should build @link references'`, () => {
    expect(
      commentPartial(
        global.getMockContext(),
        project.findReflectionByName('commentWithDocLinks').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert symbols brackets to symbol links'`, () => {
    expect(
      commentPartial(
        global.getMockContext(),
        project.findReflectionByName('commentsWithSymbolLinks').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with fenced block'`, () => {
    expect(
      commentPartial(
        global.getMockContext(),
        project.findReflectionByName('commentsWithFencedBlock').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with includes'`, () => {
    expect(
      commentPartial(
        global.getMockContext({
          includes: './test/stubs/inc',
          media: './test/stubs/media',
        }),
        project.findReflectionByName('commentsWithIncludes').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with tags'`, () => {
    expect(
      commentPartial(
        global.getMockContext(),
        project.findReflectionByName('commentsWithTags').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should allow html in comments'`, () => {
    expect(
      commentPartial(
        global.getMockContext(),
        project.findReflectionByName('commentsWithHTML').comment,
      ),
    ).toMatchSnapshot();
  });
});
