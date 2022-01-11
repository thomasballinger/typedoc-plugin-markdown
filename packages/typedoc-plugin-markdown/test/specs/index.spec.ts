import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';

import { TestApp } from '../test-app';

describe(`Index:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['reflections.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
    jest.spyOn(context, 'breadcrumbsPartial').mockReturnValue('[breadcrumbs]');
    jest.spyOn(context, 'tocPartial').mockReturnValue('[toc]');
  });

  test(`should compile readme`, () => {
    expect(
      formatContents(
        context.indexTemplate({
          model: testApp.project,
          project: testApp.project,
        } as any),
      ),
    ).toMatchSnapshot();
  });
});
