import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

const getProp = (reflection: any) => {
  const prop = reflection.findReflectionByName('prop');
  prop.sources = prop.sources.map((source) => {
    delete source.url;
    return source;
  });
  return prop;
};

describe(`Sources:`, () => {
  let bootstrap: {
    project: ProjectReflection;
    context: MarkdownThemeRenderContext;
  };
  let partial: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    bootstrap = global.bootstrap('sources.ts');
    partial = global.getTemplate(bootstrap.context, 'member.sources');
  });

  test(`should display implementation of sources'`, () => {
    expect(
      global.renderTemplate(
        partial,
        getProp(bootstrap.project.findReflectionByName('SomeClass')),
      ),
    ).toMatchSnapshot();
  });

  test(`should display inherited sources'`, () => {
    expect(
      global.renderTemplate(
        partial,
        getProp(bootstrap.project.findReflectionByName('AnotherInterface')),
      ),
    ).toMatchSnapshot();
  });

  test(`should display overide sources'`, () => {
    expect(
      global.renderTemplate(
        partial,
        getProp(bootstrap.project.findReflectionByName('AnotherClass')),
      ),
    ).toMatchSnapshot();
  });
});
