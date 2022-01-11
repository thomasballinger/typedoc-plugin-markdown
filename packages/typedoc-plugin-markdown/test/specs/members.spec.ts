import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';
import { TestApp } from '../test-app';

describe(`Members:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['members.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
    jest.spyOn(context, 'sourcesPartial').mockReturnValue('[sources]');
  });

  describe(`(members)`, () => {
    test(`should compile class members'`, () => {
      expect(
        formatContents(
          context.groupsPartial(
            (testApp.findReflection('ClassWithAccessorMembers') as any).groups,
          ),
        ),
      ).toMatchSnapshot();
    });
  });
});
