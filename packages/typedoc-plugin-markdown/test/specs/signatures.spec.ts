import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';
import { TestApp } from '../test-app';

describe(`Signatures:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['signatures.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
    jest.spyOn(context, 'sourcesPartial').mockReturnValue('[sources]');
  });

  test(`should compile callable signature'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('CallableSignature').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with a flag'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('privateFunction').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with params'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithParameters').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns an object'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionReturningAnObject').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns an object'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('promiseReturningAnObject').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns a symbol'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('promiseReturningASymbol').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns a function'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionReturningAFunction').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with rest params'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithRest').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with optional params'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithOptionalParam').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with union types'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithUnionTypes').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with default values'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithDefaults').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with @return comments'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('commentsInReturn').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithNamedParams').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters with comments'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithNamedParamsAndComments')
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile pipes in params and comments'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithPipesInParamsAndComments')
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with reference type'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithReferenceType').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with nested typen params'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('functionWithNestedParams').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile class with constructor'`, () => {
    expect(
      formatContents(
        context.signatureMemberPartial(
          testApp.findReflection('ClassWithConstructor').children[0]
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });
});
