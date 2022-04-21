import { context, project } from '../../../../test/test-utils';
import { reflectionTemplate } from './reflection.template';

describe(`Reflection Template:`, () => {
  beforeEach(async () => {});

  test(`should compile project reflection`, () => {
    const props = {
      project: project(),
      model: project(),
    } as any;
    expect(reflectionTemplate(context(), props)).toMatchSnapshot();
  });

  test(`should compile callable reflection`, () => {
    const props = {
      project: project(),
      model: project().findReflectionByName('CallableReflection'),
    } as any;
    expect(reflectionTemplate(context(), props)).toMatchSnapshot();
  });

  test(`should compile indexable reflection`, () => {
    const props = {
      project: project(),
      model: project().findReflectionByName('IndexableReflection'),
    } as any;
    expect(reflectionTemplate(context(), props)).toMatchSnapshot();
  });

  test(`should compile implemented class reflection`, () => {
    const props = {
      project: project(),
      model: project().findReflectionByName('ImplementedClass'),
    } as any;
    expect(reflectionTemplate(context(), props)).toMatchSnapshot();
  });

  test(`should compile enum reflection`, () => {
    const props = {
      project: project(),
      model: project().findReflectionByName('EnumReflection'),
    } as any;
    expect(reflectionTemplate(context(), props)).toMatchSnapshot();
  });
});
