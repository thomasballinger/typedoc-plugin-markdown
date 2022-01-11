import {
  Application,
  ReflectionKind,
  RendererEvent,
  UrlMapping,
} from 'typedoc';
import * as fs from 'fs';
import { SidebarOptions } from '../types';
import { DocusaurusTheme } from '../theme';
import { NavigationPlugin } from 'typedoc-plugin-markdown';

const CATEGORY_POSITION = {
  [ReflectionKind.Module]: 1,
  [ReflectionKind.Namespace]: 1,
  [ReflectionKind.Enum]: 2,
  [ReflectionKind.Class]: 3,
  [ReflectionKind.Interface]: 4,
  [ReflectionKind.TypeAlias]: 5,
  [ReflectionKind.Variable]: 6,
  [ReflectionKind.Function]: 7,
  [ReflectionKind.ObjectLiteral]: 8,
};

export const loadCategories = (app: Application) => {
  const sidebar = app.options.getValue('sidebar') as SidebarOptions;
  app.renderer.on(RendererEvent.END, (renderer: RendererEvent) => {
    writeCategoryYaml(
      renderer.outputDirectory,
      sidebar.categoryLabel,
      sidebar.position,
    );

    Object.keys(
      groupUrlsByKind(
        (app.renderer.theme as DocusaurusTheme)?.getUrls(renderer.project),
      ),
    ).forEach((group) => {
      const kind = parseInt(group);
      const mapping = (app.renderer.theme as DocusaurusTheme)
        ?.mappings()
        .find((mapping) => mapping.kind.includes(kind));
      if (mapping) {
        writeCategoryYaml(
          renderer.outputDirectory + '/' + mapping.directory,
          NavigationPlugin.getKindPlural(kind),
          CATEGORY_POSITION[kind],
        );
      }
    });
  });
};

const writeCategoryYaml = (
  categoryPath: string,
  label: string,
  position: number | null,
) => {
  const yaml: string[] = [`label: "${label}"`];
  if (position !== null) {
    yaml.push(`position: ${position}`);
  }
  if (fs.existsSync(categoryPath)) {
    fs.writeFileSync(categoryPath + '/_category_.yml', yaml.join('\n'));
  }
};

const groupUrlsByKind = (urls: UrlMapping[]) => {
  return urls.reduce(
    (r, v, i, a, k = v.model.kind) => ((r[k] || (r[k] = [])).push(v), r),
    {},
  );
};
