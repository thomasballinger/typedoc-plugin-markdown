import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

describe(`Types:`, () => {
  let bootstrap: {
    project: ProjectReflection;
    context: MarkdownThemeRenderContext;
  };
  let helper: Handlebars.HelperDelegate;

  beforeAll(async () => {
    bootstrap = global.bootstrap('types.ts');
    helper = bootstrap.context.Handlebars.helpers.type;
  });

  test(`should compile 'array' type'`, () => {
    expect(
      global.compileHelper(
        helper,
        (bootstrap.project.findReflectionByName('arrayType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'stringLiteral' type'`, () => {
    expect(
      global.compileHelper(
        helper,
        (bootstrap.project.findReflectionByName('stringLiteralType') as any)
          .type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of string literals types'`, () => {
    expect(
      global.compileHelper(
        helper,
        (bootstrap.project.findReflectionByName('unionType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of literal declarations`, () => {
    expect(
      global.compileHelper(
        helper,
        (
          bootstrap.project.findReflectionByName(
            'unionTypeWithSymbolsDeclarations',
          ) as any
        ).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile intrinsic type'`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('stringType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'literal' type'`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('literalType') as any).type,
        'all',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'literal' type'`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('literalType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'objectLiteralType' type'`, () => {
    expect(
      helper(
        bootstrap.project.findReflectionByName('objectLiteralType') as any,
        'object',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'objectLiteralType' type'`, () => {
    expect(
      helper(bootstrap.project.findReflectionByName('objectLiteralType')),
    ).toMatchSnapshot();
  });
  test(`should compile 'tuple' type'`, () => {
    expect(
      helper((bootstrap.project.findReflectionByName('tupleType') as any).type),
    ).toMatchSnapshot();
  });

  test(`should compile 'intersection' type'`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('intersectionType') as any)
          .type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'function' type '`, () => {
    expect(
      helper(
        bootstrap.project.findReflectionByName('functionReflectionType') as any,
        'function',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'function' type '`, () => {
    expect(
      helper(
        bootstrap.project.findReflectionByName('functionReflectionType') as any,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'typeOperator' type '`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('typeOperatorType') as any)
          .type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile unionType with object literal type '`, () => {
    expect(
      helper(
        (
          bootstrap.project.findReflectionByName(
            'objectLiteralUnionType',
          ) as any
        ).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile conditional type '`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('ConditionalType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs'`, () => {
    expect(
      helper(
        (bootstrap.project.findReflectionByName('externalReference') as any)
          .type,
      ),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs with type params'`, () => {
    expect(
      helper(
        (
          bootstrap.project.findReflectionByName(
            'externalReferenceInsideTypeParams',
          ) as any
        ).type,
      ),
    ).toMatchSnapshot();
  });
});
