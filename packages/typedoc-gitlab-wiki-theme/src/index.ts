import { Application, Options, OptionsReader } from 'typedoc';
import { GitlabWikiTheme } from './theme';

export function load(app: Application) {
  app.renderer.defineTheme('gitlab-wiki', GitlabWikiTheme);

  app.options.addReader(
    new (class implements OptionsReader {
      priority: number;
      name = 'gitlab-wiki-theme-options-reader';
      read(container: Options) {
        container.setValue('entryDocument', 'home.md');
        container.setValue('hideBreadcrumbs', true);
        container.setValue('hidePageTitle', true);
      }
    })(),
  );
}
