import * as fs from 'fs';
import { ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

describe(`Theme:`, () => {
  describe(`Exports`, () => {
    let bootstrap: {
      project: ProjectReflection;
      context: MarkdownThemeRenderContext;
      outDir: string;
    };
    test(`should write sidebar for exports'`, async () => {
      bootstrap = global.bootstrap('theme.ts', {
        options: { theme: 'github-wiki' },
        plugin: ['typedoc-plugin-markdown', './dist'],
      });
      const sidebarFile = fs.readFileSync(bootstrap.outDir + '/_Sidebar.md');
      expect(sidebarFile.toString()).toMatchSnapshot();
    });
  });

  describe(`Exports`, () => {
    let bootstrap: {
      project: ProjectReflection;
      context: MarkdownThemeRenderContext;
      outDir: string;
    };
    test(`should write sidebar for modules'`, async () => {
      bootstrap = global.bootstrap(['breadcrumbs.ts', 'theme.ts'], {
        options: { theme: 'github-wiki' },
        plugin: ['typedoc-plugin-markdown', './dist'],
      });
      const sidebarFile = fs.readFileSync(bootstrap.outDir + '/_Sidebar.md');
      expect(sidebarFile.toString()).toMatchSnapshot();
    });
  });
});
