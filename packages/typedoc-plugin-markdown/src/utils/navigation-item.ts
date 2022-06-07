import { Application, ProjectReflection, Reflection } from 'typedoc';
import { MarkdownTheme } from '../theme';
import { getKindPlural } from './helpers';

export class NavigationItem {
  title: string;
  url: string;
  dedicatedUrls?: string[];
  parent?: NavigationItem;
  children?: NavigationItem[];
  isLabel?: boolean;
  isVisible?: boolean;
  isCurrent?: boolean;
  isModules?: boolean;
  isInPath?: boolean;
  reflection?: Reflection;

  constructor(
    title?: string,
    url?: string,
    parent?: NavigationItem,
    reflection?: Reflection,
  ) {
    this.title = title || '';
    this.url = url || '';
    this.parent = parent;
    this.reflection = reflection;

    if (!url) {
      this.isLabel = true;
    }

    if (this.parent) {
      if (!this.parent.children) {
        this.parent.children = [];
      }
      this.parent.children.push(this);
    }
  }

  static create(
    reflection: Reflection,
    parent?: NavigationItem,
    useShortNames?: boolean,
  ) {
    let name: string;
    if (useShortNames || (parent && parent.parent)) {
      name = reflection.name;
    } else {
      name = reflection.getFullName();
    }

    name = name.trim();

    return new NavigationItem(name, reflection.url, parent, reflection);
  }
}

export function getNavigation(app: Application, project: ProjectReflection) {
  const urls = app.renderer.theme?.getUrls(project);
  const entryDocument = app.options.getValue('entryDocument') as string;
  const readme = app.options.getValue('readme') as string;
  const entryPoints = app.options.getValue('entryPoints') as string[];
  const getUrlMapping = (name) => {
    if (!name) {
      return '';
    }
    return urls?.find((url) => url.model.name === name);
  };

  const createNavigationItem = (
    title: string,
    url: string | undefined,
    isLabel: boolean,
    children: NavigationItem[] = [],
  ) => {
    const navigationItem = new NavigationItem(title, url);

    navigationItem.isLabel = isLabel;
    navigationItem.children = children;
    const { reflection, parent, ...filteredNavigationItem } = navigationItem;
    return filteredNavigationItem as NavigationItem;
  };
  const navigation = createNavigationItem(project.name, undefined, false);
  const hasReadme = !readme.endsWith('none');
  if (hasReadme) {
    navigation.children?.push(
      createNavigationItem('Readme', entryDocument, false),
    );
  }
  if (entryPoints.length === 1) {
    navigation.children?.push(
      createNavigationItem(
        'Exports',
        hasReadme ? 'globals.md' : entryDocument,
        false,
      ),
    );
  }
  (app.renderer.theme as MarkdownTheme)?.mappings.forEach((mapping) => {
    const kind = mapping.kind[0];
    const items = project.getReflectionsByKind(kind);
    if (items.length > 0) {
      const children = items
        .map((item) =>
          createNavigationItem(
            item.getFullName(),
            (getUrlMapping(item.name) as any)?.url as string,
            true,
          ),
        )
        .sort((a, b) => (a.title > b.title ? 1 : -1));
      const group = createNavigationItem(
        getKindPlural(kind),
        undefined,
        true,
        children,
      );
      navigation.children?.push(group);
    }
  });
  return navigation;
}
