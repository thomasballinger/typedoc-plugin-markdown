import * as fs from 'fs';
import { ProjectReflection } from 'typedoc';
import { MarkdownThemeRenderContext } from 'typedoc-plugin-markdown';

describe(`Theme:`, () => {
  let bootstrap: {
    project: ProjectReflection;
    context: MarkdownThemeRenderContext;
    outDir: string;
  };

  beforeAll(async () => {
    bootstrap = global.bootstrap('theme.ts', {
      options: { theme: 'gitlab-wiki' },
      plugin: ['typedoc-plugin-markdown', './dist'],
    });
  });
  test(`should write sidebar'`, async () => {
    const sidebarFile = fs.readFileSync(bootstrap.outDir + '/_sidebar.md');
    expect(sidebarFile.toString()).toMatchSnapshot();
  });
});
