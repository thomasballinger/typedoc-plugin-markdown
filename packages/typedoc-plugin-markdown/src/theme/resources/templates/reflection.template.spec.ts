import { getContext, getProject } from '../../../../test/test-utils';
import { reflectionTemplate } from './reflection.template';

describe(`Reflection Template:`, () => {
  const project = getProject();
  beforeEach(async () => {});

  test(`should compile project reflection`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    expect(reflectionTemplate(getContext(), props)).toMatchSnapshot();
  });

  test(`should compile project reflection with options`, () => {
    const props = {
      project: project,
      model: project,
    } as any;
    const options = { hideBreadcrumbs: true, hidePageTitle: true };
    expect(reflectionTemplate(getContext(options), props)).toMatchSnapshot();
  });

  test(`should compile callable reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('CallableReflection'),
    } as any;
    expect(reflectionTemplate(getContext(), props)).toMatchSnapshot();
  });

  test(`should compile indexable reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('IndexableReflection'),
    } as any;
    expect(reflectionTemplate(getContext(), props)).toMatchSnapshot();
  });

  test(`should compile implemented class reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('ImplementedClass'),
    } as any;
    expect(reflectionTemplate(getContext(), props)).toMatchSnapshot();
  });

  test(`should compile enum reflection`, () => {
    const props = {
      project,
      model: project.findReflectionByName('EnumReflection'),
    } as any;
    expect(reflectionTemplate(getContext(), props)).toMatchSnapshot();
  });
});
