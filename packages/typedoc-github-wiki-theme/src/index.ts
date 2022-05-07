import { Application, RendererEvent } from 'typedoc';
import { getNavigation } from 'typedoc-plugin-markdown';
import { GithubWikiThemeOptionsReader } from './options-reader';
import { writeSidebar } from './sidebar';
import { GithubWikiTheme } from './theme';

export function load(app: Application) {
  app.renderer.defineTheme('github-wiki', GithubWikiTheme);
  app.options.addReader(new GithubWikiThemeOptionsReader());

  app.renderer.on(RendererEvent.END, (context: RendererEvent) => {
    const navigation = getNavigation(app, context.project);
    console.log(navigation);
    writeSidebar(navigation, context.outputDirectory);
  });
}
