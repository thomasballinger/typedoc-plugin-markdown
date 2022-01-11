
import { MarkdownThemeContext } from '../../src';
import { TestApp } from '../test-app';

describe(`Types:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['types.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
  });

  test(`should compile 'array' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('arrayType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'stringLiteral' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('stringLiteralType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of string literals types'`, () => {
    expect(
      context.typePartial(testApp.findReflection('unionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of literal declarations`, () => {
    expect(
      context.typePartial(
        testApp.findReflection('unionTypeWithSymbolsDeclarations').type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile intrinsic type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('stringType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'literal' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('literalType').type, 'all'),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'literal' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('literalType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'objectLiteralType' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('objectLiteralType').type, 'object'),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'objectLiteralType' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('objectLiteralType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'tuple' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('tupleType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'intersection' type'`, () => {
    expect(
      context.typePartial(testApp.findReflection('intersectionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'function' type '`, () => {
    expect(
      context.typePartial(
        testApp.findReflection('functionReflectionType').type,
        'function',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'function' type '`, () => {
    expect(
      context.typePartial(testApp.findReflection('functionReflectionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'typeOperator' type '`, () => {
    expect(
      context.typePartial(testApp.findReflection('typeOperatorType').type),
    ).toMatchSnapshot();
  });

  test(`should compile unionType with object literal type '`, () => {
    expect(
      context.typePartial(testApp.findReflection('objectLiteralUnionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile conditional type '`, () => {
    expect(
      context.typePartial(testApp.findReflection('ConditionalType').type),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs'`, () => {
    expect(
      context.typePartial(testApp.findReflection('externalReference').type),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs with type params'`, () => {
    expect(
      context.typePartial(
        testApp.findReflection('externalReferenceInsideTypeParams').type,
      ),
    ).toMatchSnapshot();
  });
});
