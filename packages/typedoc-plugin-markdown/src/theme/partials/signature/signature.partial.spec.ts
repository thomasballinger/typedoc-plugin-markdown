import {
  DeclarationReflection,
  ProjectReflection,
  SignatureReflection,
} from 'typedoc';
import { signaturePartial } from './signature.partial';

describe(`Signature Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('signatures.ts');
  });

  test(`should compile signature with a flag`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'privateFunction',
          ) as DeclarationReflection
        ).signatures[0],
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with params'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithParameters',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns an object'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionReturningAnObject',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns an object'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'promiseReturningAnObject',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a promise that returns a symbol'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'promiseReturningASymbol',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns a function'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionReturningAFunction',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with rest params'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithRest',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with optional params'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithOptionalParam',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with union types'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithUnionTypes',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with default values'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithDefaults',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with @return comments'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'commentsInReturn',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithNamedParams',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters with comments'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithNamedParamsAndComments',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile pipes in params and comments'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithPipesInParamsAndComments',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with reference type'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithReferenceType',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with nested typen params'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'functionWithNestedParams',
          ) as DeclarationReflection
        ).signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile class with constructor'`, () => {
    expect(
      signaturePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'ClassWithConstructor',
          ) as DeclarationReflection
        ).children[0].signatures[0] as SignatureReflection,
      ),
    ).toMatchSnapshot();
  });
});
