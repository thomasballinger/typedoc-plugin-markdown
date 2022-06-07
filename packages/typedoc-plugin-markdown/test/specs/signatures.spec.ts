import * as Handlebars from 'handlebars/runtime';
import { SignatureReflection } from 'typedoc';

describe(`Signatures:`, () => {
  let project: any;
  let partial: Handlebars.TemplateDelegate;
  let reflectionTemplate: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    const bootstrap = global.bootstrap('signatures.ts', {
      stubPartials: ['member.sources'],
    });
    project = bootstrap.project;
    partial = global.getTemplate(bootstrap.context, 'member.signature');
    reflectionTemplate = global.getTemplate(
      bootstrap.context,
      'reflection',
      false,
    );
  });

  test(`should compile callable signature'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('CallableSignature').signatures[0],
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with a flag'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('privateFunction')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with params'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithParameters')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns an object'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionReturningAnObject')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns an object'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('promiseReturningAnObject')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns a symbol'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('promiseReturningASymbol')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns a function'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionReturningAFunction')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with rest params'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithRest')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with optional params'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithOptionalParam')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with union types'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithUnionTypes')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with default values'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithDefaults')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with @return comments'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('commentsInReturn')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithNamedParams')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters with comments'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithNamedParamsAndComments')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile pipes in params and comments'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithPipesInParamsAndComments')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with reference type'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithReferenceType')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with nested typen params'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('functionWithNestedParams')
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile class with constructor'`, () => {
    expect(
      global.renderTemplate(
        partial,
        project.findReflectionByName('ClassWithConstructor').children[0]
          .signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });
});
