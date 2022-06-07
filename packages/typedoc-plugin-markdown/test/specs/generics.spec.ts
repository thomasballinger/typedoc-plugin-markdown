import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection, SignatureReflection } from 'typedoc';

describe(`Generics:`, () => {
  let project: ProjectReflection;
  let partial: Handlebars.TemplateDelegate;
  let declarationPartial: Handlebars.TemplateDelegate;
  let reflectionTemplate: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    const bootstrap = global.bootstrap('generics.ts', {
      stubPartials: [
        'comment',
        'members',
        'member.signature',
        'member.sources',
      ],
      stubHelpers: ['toc', 'breadcrumbs', 'hierarchy', 'returns'],
    });
    project = bootstrap.project;
    partial = global.getTemplate(bootstrap.context, 'member.signature');
    declarationPartial = global.getTemplate(
      bootstrap.context,
      'member.declaration',
    );
    reflectionTemplate = global.getTemplate(
      bootstrap.context,
      'reflection',
      false,
    );
  });

  test(`should compile class with type params`, () => {
    expect(
      global.renderTemplate(reflectionTemplate, {
        model: project.findReflectionByName('ClassWithTypeParams'),
        project: project,
      }),
    ).toMatchSnapshot();
  });

  test(`should compile function with a simple type param'`, () => {
    expect(
      global.renderTemplate(
        partial,
        (project.findReflectionByName('functionWithTypeParam') as any)
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with complex type params'`, () => {
    expect(
      global.renderTemplate(
        partial,
        (project.findReflectionByName('functionWithTypeParams') as any)
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type with nested generics'`, () => {
    expect(
      global.renderTemplate(
        declarationPartial,
        project.findReflectionByName('nestedGenerics'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile generics with defaults'`, () => {
    expect(
      global.renderTemplate(
        declarationPartial,
        (project.findReflectionByName('genericsWithDefaults') as any)
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });
});
