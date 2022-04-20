import { ProjectReflection } from 'typedoc';
import { TestApp } from '../../../../test/test-app';
import { MarkdownThemeRenderContext } from '../../theme.context';
import { reflectionTemplate } from './reflection.template';

describe(`Reflection Template:`, () => {
  let testApp: TestApp;
  let project: ProjectReflection;
  let context: MarkdownThemeRenderContext;

  beforeEach(async () => {
    testApp = new TestApp(['index.ts']);

    testApp.bootstrap();

    project = testApp.app.convert() as ProjectReflection;

    context = {
      breadcrumbsPartial: (props: any) => '[breadcrumbsPartial]',
      commentPartial: (props: any) => '[commentPartial]',
      groupsPartial: (props: any) => '[groupsPartial]',
      indexSignatureTitlePartial: (props: any) =>
        '[indexSignatureTitlePartial]',
      reflectionPathPartial: (props: any) => '[reflectionPathPartial]',
      reflectionTitlePartial: (props: any) => '[reflectionTitlePartial]',
      signaturePartial: (props: any) => '[reflectionTitlePartial]',
      tocPartial: (props: any) => '[tocPartial]',
      typePartial: (props: any) => '[typePartial]',
      options: {},
    } as any;
  });

  test(`should compile project reflection`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    expect(reflectionTemplate(context, props)).toMatchSnapshot();
  });

  test(`should compile callable reflection`, () => {
    const props = {
      project: project,
      model: project.findReflectionByName('CallableReflection'),
    } as any;
    expect(reflectionTemplate(context, props)).toMatchSnapshot();
  });

  test(`should compile indexable reflection`, () => {
    const props = {
      project: project,
      model: project.findReflectionByName('IndexableReflection'),
    } as any;
    expect(reflectionTemplate(context, props)).toMatchSnapshot();
  });

  test(`should compile implemented class`, () => {
    const props = {
      project: project,
      model: project.findReflectionByName('ImplementedClass'),
    } as any;
    expect(reflectionTemplate(context, props)).toMatchSnapshot();
  });

  test(`should compile Enum`, () => {
    const props = {
      project: project,
      model: project.findReflectionByName('EnumReflection'),
    } as any;
    expect(reflectionTemplate(context, props)).toMatchSnapshot();
  });
});
