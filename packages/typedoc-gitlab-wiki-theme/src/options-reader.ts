import { Options, OptionsReader } from 'typedoc';

export class GitlabWikiThemeOptionsReader implements OptionsReader {
  priority = 1000;
  name = 'gitlab-wiki-theme-reader';
  read(container: Options) {
    if (container.getValue('theme') === 'gitlab-wiki') {
      container.setValue('entryDocument', 'home.md');
      container.setValue('hideBreadcrumbs', true);
      container.setValue('hidePageTitle', true);
    }
  }
}
