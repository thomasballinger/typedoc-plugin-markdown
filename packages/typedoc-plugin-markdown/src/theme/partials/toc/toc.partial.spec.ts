import { DeclarationReflection, ProjectReflection, Reflection } from 'typedoc';
import { tocPartial } from './toc.partial';

describe(`TOC Partial:`, () => {
  let project: ProjectReflection;
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  beforeAll(async () => {
    project = global.getProject('toc.ts');
    moduleReflection = project;
    classReflection = project.findReflectionByName('SomeClass');
  });

  describe(`(default)`, () => {
    test(`should display toc for module'`, () => {
      expect(
        tocPartial(
          global.getMockContext(),
          moduleReflection as DeclarationReflection,
        ),
      ).toMatchSnapshot();
    });

    test(`should display toc for class'`, () => {
      expect(
        tocPartial(
          global.getMockContext(),
          classReflection as DeclarationReflection,
        ),
      ).toMatchSnapshot();
    });
  });
  describe(`(hideInPageToc)`, () => {
    test(`should not display toc for class'`, () => {
      expect(
        tocPartial(
          global.getMockContext({ hideInPageTOC: true }),
          classReflection as DeclarationReflection,
        ),
      ).toEqual('');
    });
  });
});
