import { Application, Options, OptionsReader } from 'typedoc';
import { HugoTheme } from './theme';

export function load(app: Application) {
  app.renderer.defineTheme('hugo', HugoTheme);

  app.options.addReader(
    new (class implements OptionsReader {
      priority: 1000;
      name = 'hugo-theme-options-reader';
      read(container: Options) {
        container.setValue('entryDocument', '_index.md');
        container.setValue('hideBreadcrumbs', true);
        container.setValue('hidePageTitle', true);
      }
    })(),
  );
}
