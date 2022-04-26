import { DeclarationReflection, ProjectReflection } from 'typedoc';
import { sourcesPartial } from './sources.partial';

const getProp = (reflection: DeclarationReflection) => {
  const prop = reflection.findReflectionByName('prop');
  prop.sources = prop.sources.map((source) => {
    delete source.url;
    return source;
  });
  return prop;
};

describe(`Sources Partial:`, () => {
  let project: ProjectReflection;

  beforeAll(async () => {
    project = global.getProject('sources.ts');
  });

  test(`should display implementation of sources'`, () => {
    expect(
      sourcesPartial(
        global.getMockContext(),
        getProp(
          project.findReflectionByName('SomeClass') as DeclarationReflection,
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should display inherited sources'`, () => {
    expect(
      sourcesPartial(
        global.getMockContext(),
        getProp(
          project.findReflectionByName(
            'AnotherInterface',
          ) as DeclarationReflection,
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });

  test(`should display overide sources'`, () => {
    expect(
      sourcesPartial(
        global.getMockContext(),
        getProp(
          project.findReflectionByName('AnotherClass') as DeclarationReflection,
        ) as DeclarationReflection,
      ),
    ).toMatchSnapshot();
  });
});
