import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';
import { TestApp } from '../test-app';

describe(`Hierarchy:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['hierarchy.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
  });
  test(`should compile type hierarchy`, () => {
    const reflection = testApp.findReflection('ParentClass') as any;
    expect(
      formatContents(context.hierarchyPartial(reflection.typeHierarchy, 0)),
    ).toMatchSnapshot();
  });

  test(`should compile nested type hierarchy`, () => {
    const reflection = testApp.findReflection('ChildClassA') as any;
    expect(
      formatContents(context.hierarchyPartial(reflection.typeHierarchy, 0)),
    ).toMatchSnapshot();
  });
});
