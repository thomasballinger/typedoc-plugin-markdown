import { ProjectReflection } from 'typedoc';
import { typePartial } from './type.partial';

describe(`typePartial`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('types.ts');
  });

  test(`should compile 'array' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('arrayType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'stringLiteral' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('stringLiteralType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of string literals types'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('unionType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of literal declarations`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'unionTypeWithSymbolsDeclarations',
          ) as any
        ).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile intrinsic type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('stringType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'literal' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('literalType') as any).type,
        'all',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'literal' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('literalType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'objectLiteralType' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        project.findReflectionByName('objectLiteralType') as any,
        'object',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'objectLiteralType' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        project.findReflectionByName('objectLiteralType') as any,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'tuple' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('tupleType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'intersection' type'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('intersectionType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'function' type '`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('functionReflectionType') as any).type,
        'function',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'function' type '`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('functionReflectionType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile 'typeOperator' type '`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('typeOperatorType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile unionType with object literal type '`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('objectLiteralUnionType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile conditional type '`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('ConditionalType') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (project.findReflectionByName('externalReference') as any).type,
      ),
    ).toMatchSnapshot();
  });

  test(`should resolve external refs with type params'`, () => {
    expect(
      typePartial(
        global.getMockContext(),
        (
          project.findReflectionByName(
            'externalReferenceInsideTypeParams',
          ) as any
        ).type,
      ),
    ).toMatchSnapshot();
  });
});
