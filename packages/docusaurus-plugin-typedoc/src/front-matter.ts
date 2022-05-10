import * as path from 'path';
import { Application, DeclarationReflection, PageEvent } from 'typedoc';
import { DocusaurusTheme } from './theme';
import { PluginOptions } from './types';

export const applyFrontmatter = (
  app: Application,
  pluginOptions: PluginOptions,
  typedocOptions: any,
) => {
  app.renderer.on(
    PageEvent.END,
    (context: PageEvent<DeclarationReflection>) => {
      if (context.contents) {
        context.contents = prependYAML(
          context.contents,
          getYamlItems(context) as any,
        );
      }

      function getYamlItems(page: PageEvent<DeclarationReflection>): any {
        const pageId = getId(page);
        const pageTitle = getTitle(page);
        const sidebarLabel = getSidebarLabel(page);
        const sidebarPosition = getSidebarPosition(page);
        let items: any = {
          id: pageId,
          title: pageTitle,
        };

        if (sidebarLabel) {
          items = { ...items, sidebar_label: sidebarLabel as string };
        }
        if (sidebarPosition) {
          items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
        }
        if (
          page.url === page.project.url &&
          typedocOptions.entryPoints.length > 1
        ) {
          items = { ...items, hide_table_of_contents: true };
        }
        items = { ...items, custom_edit_url: null };
        if (pluginOptions.frontmatter) {
          items = { ...items, ...pluginOptions.frontmatter };
        }
        return {
          ...items,
        };
      }

      function getId(page: PageEvent) {
        return path.basename(page.url, path.extname(page.url));
      }

      function getTitle(page: PageEvent) {
        const readmeTitle = pluginOptions.readmeTitle || page.project.name;
        if (
          page.url === typedocOptions.entryDocument &&
          page.url !== page.project.url
        ) {
          return readmeTitle;
        }
        return (app.renderer.theme as DocusaurusTheme)
          ?.getRenderContext()
          .pageTitlePartial(page, false);
      }

      function getSidebarLabel(page: PageEvent<DeclarationReflection>) {
        if (page.url === typedocOptions.entryDocument) {
          return page.url === page.project.url
            ? page.project.name
            : pluginOptions.sidebar.readmeLabel;
        }

        if (page.url === typedocOptions.globalsFile) {
          return page.project.name;
        }

        return pluginOptions.sidebar.fullNames
          ? page.model.getFullName()
          : page.model.name;
      }

      function getSidebarPosition(page: PageEvent<DeclarationReflection>) {
        if (page.url === typedocOptions.entryDocument) {
          return page.url === page.project.url ? '0.5' : '0';
        }
        if (page.url === typedocOptions.globalsFile) {
          return '0.5';
        }
        if (page.model.getFullName().split('.').length === 1) {
          return '0';
        }
        return null;
      }
    },
  );
};

export interface FrontMatterVars {
  [key: string]: string | number | boolean;
}

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export const prependYAML = (contents: string, vars: FrontMatterVars) => {
  return contents
    .replace(/^/, toYAML(vars) + '\n\n')
    .replace(/[\r\n]{3,}/g, '\n\n');
};

/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars: FrontMatterVars) => {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === 'string' ? `"${escapeString(value)}"` : value
      }`,
  )
  .join('\n')}
---`;
  return yaml;
};

// prettier-ignore
const escapeString=(str: string) => str.replace(/"/g, '\\"');
