import { Application, PageEvent } from 'typedoc';

export function load(app: Application) {
  app.renderer.on(PageEvent.BEGIN, (page: PageEvent<any>) => {
    (page as any).frontmatter = { title: 'hello', label: 'goodbye' };
  });

  app.renderer.on(PageEvent.END, (page: PageEvent<any>) => {
    if ((page as any).frontmatter && page.contents) {
      page.contents = prependYAML(page.contents, (page as any).frontmatter);
    }
  });
}

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export const prependYAML = (
  contents: string,
  vars: Record<string, string | number | boolean>,
) => {
  return contents
    .replace(/^/, toYAML(vars) + '\n\n')
    .replace(/[\r\n]{3,}/g, '\n\n');
};

/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars: Record<string, string | number | boolean>) => {
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

const escapeString = (str: string) => str.replace(/"/g, '\\"');
