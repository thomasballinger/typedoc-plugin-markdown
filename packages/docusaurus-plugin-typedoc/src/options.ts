import { PluginOptions } from './types';

const DEFAULT_PLUGIN_OPTIONS: any = {
  frontmatter: undefined,
  id: 'default',
  docsRoot: 'docs',
  includeExtension: true,
  indexSlug: undefined,
  sidebar: {
    fullNames: false,
    categoryLabel: 'API',
    indexLabel: undefined,
    readmeLabel: 'Readme',
    position: null,
  },
};

const DEFAULT_TYPEDOC_OPTIONS: any = {
  out: 'api',
  cleanOutputDir: true,
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  hidePageTitle: true,
  entryDocument: 'index.md',
  plugin: ['none'],
  watch: false,
  theme: 'docusaurus',
};

export const getTypedocOptions = (
  opts: Partial<PluginOptions>,
): PluginOptions => {
  const options = {
    ...DEFAULT_TYPEDOC_OPTIONS,
    ...Object.fromEntries(
      Object.entries(opts).filter(([key]) => !(key in DEFAULT_PLUGIN_OPTIONS)),
    ),
  };
  return options;
};

export const getPluginOptions = (
  opts: Partial<PluginOptions>,
): PluginOptions => {
  const options = {
    ...DEFAULT_PLUGIN_OPTIONS,
    ...Object.fromEntries(
      Object.entries(opts).filter(([key]) => key in DEFAULT_PLUGIN_OPTIONS),
    ),
    sidebar: {
      ...DEFAULT_PLUGIN_OPTIONS.sidebar,
      ...opts.sidebar,
    },
  };
  return options;
};
