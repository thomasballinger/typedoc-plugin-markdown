import { DeclarationReflection } from 'typedoc';
import { MarkdownThemeContext } from '../../src';
import { formatContents } from '../../src/utils/format';
import { TestApp } from '../test-app';

describe(`Declarations:`, () => {
  let testApp: TestApp;
  let context: MarkdownThemeContext;

  beforeAll(async () => {
    testApp = new TestApp(['declarations.ts']);
    await testApp.bootstrap();
    context = testApp.getRenderContext();
    jest.spyOn(context, 'sourcesPartial').mockReturnValue('[sources]');
  });

  test(`should compile a const with default value`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'stringConstWithDefaultValue',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a let with default value`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'stringLetWithDefaultValue',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile an undefined declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'undefinedNumberDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'objectLiteralDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal cast as a const`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'objectLiteralAsConstDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'typeLiteralDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile declaration with double underscores in name and value`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            '__DOUBLE_UNDERSCORES_DECLARATION__',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile any function type`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection('AnyFunctionType') as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'functionDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile callable declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'callableDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile indexable declaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          testApp.findReflection(
            'indexableDeclaration',
          ) as DeclarationReflection,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile enum delcaration`, () => {
    expect(
      formatContents(
        context.declarationMemberPartial(
          (testApp.findReflection('EnumDeclarations') as DeclarationReflection)
            .children[0],
        ),
      ),
    ).toMatchSnapshot();
  });
});
