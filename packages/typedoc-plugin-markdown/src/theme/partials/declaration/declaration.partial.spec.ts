import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { declarationPartial } from './declaration.partial';

describe(`Declaration Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject(__dirname);
  });

  test(`should compile a const with default value`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'stringConstWithDefaultValue',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile an undefined declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'undefinedNumberDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'objectLiteralDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal cast as a const`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'objectLiteralAsConstDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'typeLiteralDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile declaration with double underscores in name and value`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          '__DOUBLE_UNDERSCORES_DECLARATION__',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile any function type`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'AnyFunctionType',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'functionDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile callable declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'callableDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile indexable declaration`, () => {
    expect(
      declarationPartial(
        global.getMockContext(),
        project.findReflectionByName(
          'indexableDeclaration',
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile enum delcaration`, () => {
    const props = project.findReflectionByName(
      'EnumDeclarations',
    ) as DeclarationReflection;
    expect(
      declarationPartial(global.getMockContext(), props),
    ).toMatchSnapshot();
  });
});
