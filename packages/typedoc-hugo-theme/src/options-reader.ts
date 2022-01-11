import { Options, OptionsReader } from 'typedoc';

export class HugoThemeOptionsReader implements OptionsReader {
  priority = 1000;
  name = 'hugo-theme-reader';
  read(container: Options) {
    if (container.getValue('theme') === 'hugo') {
      container.setValue('entryDocument', '_index.md');
      container.setValue('hideBreadcrumbs', true);
      container.setValue('hidePageTitle', true);
    }
  }
}
