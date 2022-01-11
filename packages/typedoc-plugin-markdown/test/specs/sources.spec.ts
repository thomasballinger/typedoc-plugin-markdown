import { DeclarationReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';

import { TestApp } from '../test-app';

const getProp = (reflection: DeclarationReflection) => {
  const prop = reflection.findReflectionByName('prop');
  prop.sources = prop.sources.map((source) => {
    delete source.url;
    return source;
  });
  return prop as any;
};

describe(`Sources:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;
  beforeAll(async () => {
    testApp = new TestApp(['sources.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
  });

  test(`should display implementation of sources'`, () => {
    expect(
      formatContents(
        context.sourcesPartial(getProp(testApp.findReflection('SomeClass'))),
      ),
    ).toMatchSnapshot();
  });

  test(`should display inherited sources'`, () => {
    expect(
      formatContents(
        context.sourcesPartial(
          getProp(testApp.findReflection('AnotherInterface')),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should display overide sources'`, () => {
    expect(
      formatContents(
        context.sourcesPartial(getProp(testApp.findReflection('AnotherClass'))),
      ),
    ).toMatchSnapshot();
  });
});
