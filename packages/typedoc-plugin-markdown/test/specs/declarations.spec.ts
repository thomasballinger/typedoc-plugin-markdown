import * as Handlebars from 'handlebars/runtime';
import { ProjectReflection } from 'typedoc';

describe(`Declarations:`, () => {
  let project: ProjectReflection;
  let template: Handlebars.TemplateDelegate;

  beforeAll(async () => {
    const bootstrap = global.bootstrap('declarations.ts', {
      stubPartials: ['member.sources'],
    });
    project = bootstrap.project;
    template = global.getTemplate(bootstrap.context, 'member.declaration');
  });

  test(`should compile a const with default value`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('stringConstWithDefaultValue'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a let with default value`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('stringLetWithDefaultValue'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile an undefined declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('undefinedNumberDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('objectLiteralDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal cast as a const`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('objectLiteralAsConstDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('typeLiteralDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile declaration with double underscores in name and value`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('__DOUBLE_UNDERSCORES_DECLARATION__'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile any function type`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('AnyFunctionType'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('functionDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile callable declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('callableDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile indexable declaration`, () => {
    expect(
      global.renderTemplate(
        template,
        project.findReflectionByName('indexableDeclaration'),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile enum delcaration`, () => {
    expect(
      global.renderTemplate(
        template,
        (project.findReflectionByName('EnumDeclarations') as any).children[0],
      ),
    ).toMatchSnapshot();
  });
});
