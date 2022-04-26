import { ProjectReflection } from 'typedoc';
import { reflectionTemplate } from './reflection.template';

describe(`Reflection Template:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('reflections.ts');
  });

  test(`should compile project reflection`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    expect(
      reflectionTemplate(global.getMockContext(), props),
    ).toMatchSnapshot();
  });

  test(`should compile project reflection with options`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    const options = { hideBreadcrumbs: true, hidePageTitle: true };
    expect(
      reflectionTemplate(global.getMockContext(options), props),
    ).toMatchSnapshot();
  });

  test(`should compile callable reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('CallableReflection'),
    } as any;
    expect(
      reflectionTemplate(global.getMockContext(), props),
    ).toMatchSnapshot();
  });

  test(`should compile indexable reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('IndexableReflection'),
    } as any;
    expect(
      reflectionTemplate(global.getMockContext(), props),
    ).toMatchSnapshot();
  });

  test(`should compile implemented class reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('ImplementedClass'),
    } as any;
    expect(
      reflectionTemplate(global.getMockContext(), props),
    ).toMatchSnapshot();
  });

  test(`should compile enum reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('EnumReflection'),
    } as any;
    expect(
      reflectionTemplate(global.getMockContext(), props),
    ).toMatchSnapshot();
  });
});
