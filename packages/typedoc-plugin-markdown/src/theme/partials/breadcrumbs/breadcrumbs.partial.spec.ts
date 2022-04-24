import { ProjectReflection } from 'typedoc';
import { breadcrumbsPartial } from './breadcrumbs.partial';

describe(`Breadcrumbs Partial:`, () => {
  describe(`(with readme)`, () => {
    let project: ProjectReflection;

    beforeEach(async () => {
      project = {
        name: 'project-name',
        url: 'modules.md',
      } as ProjectReflection;
    });
    test(`should compile README breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext(), {
          project: project,
          model: project,
          url: 'README.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext(), {
          project: project,
          model: {
            parent: { url: 'modules.md' },
            url: 'breadcrumbs.md',
            name: 'breadcrumbs',
          },
          url: 'breadcrumbs.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext(), {
          project: project,
          model: {
            parent: {
              parent: { url: 'modules.md' },
              url: 'breadcrumbs.md',
              name: 'breadcrumbs.md',
            },
            url: 'breadcrumbs.Breadcrumbs.md',
            name: 'Breadcrumbs',
          },
          url: 'breadcrumbs.Breadcrumbs.md',
        } as any),
      ).toMatchSnapshot();
    });
  });

  describe(`(without readme)`, () => {
    let project: ProjectReflection;

    beforeEach(async () => {
      project = {
        name: 'project-name',
        url: 'modules.md',
      } as ProjectReflection;
    });
    test(`should compile README breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext({ readme: 'none' }), {
          project: project,
          model: project,
          url: 'README.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext({ readme: 'none' }), {
          project: project,
          model: {
            parent: { url: 'modules.md' },
            url: 'breadcrumbs.md',
            name: 'breadcrumbs',
          },
          url: 'breadcrumbs.md',
        } as any),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      expect(
        breadcrumbsPartial(global.getMockContext({ readme: 'none' }), {
          project: project,
          model: {
            parent: {
              parent: { url: 'modules.md' },
              url: 'breadcrumbs.md',
              name: 'breadcrumbs.md',
            },
            url: 'breadcrumbs.Breadcrumbs.md',
            name: 'Breadcrumbs',
          },
          url: 'breadcrumbs.Breadcrumbs.md',
        } as any),
      ).toMatchSnapshot();
    });
  });
});
