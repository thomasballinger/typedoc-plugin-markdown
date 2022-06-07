import { Application, Options, OptionsReader } from 'typedoc';
import { GithubWikiTheme } from './theme';

export function load(app: Application) {
  app.renderer.defineTheme('github-wiki', GithubWikiTheme);

  app.options.addReader(
    new (class implements OptionsReader {
      priority: number;
      name = 'github-wiki-theme-options-reader';
      read(container: Options) {
        container.setValue('entryDocument', 'Home.md');
        container.setValue('hideBreadcrumbs', true);
      }
    })(),
  );
}
