import { ReflectionKind } from 'typedoc';
import { FrontMatterVars } from './models';

export const KIND_PLURALS = {
  [ReflectionKind.Class]: 'Classes',
  [ReflectionKind.Property]: 'Properties',
  [ReflectionKind.Enum]: 'Enumerations',
  [ReflectionKind.EnumMember]: 'Enumeration embers',
  [ReflectionKind.TypeAlias]: 'Type Aliases',
};

export function getKindPlural(kind: ReflectionKind): string {
  if (kind in KIND_PLURALS) {
    return KIND_PLURALS[kind as keyof typeof KIND_PLURALS];
  } else {
    return getKindString(kind) + 's';
  }
}

export function getKindString(kind: ReflectionKind): string {
  let str = ReflectionKind[kind];
  str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + ' ' + b.toLowerCase());
  return str;
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

const toYAML = (vars: FrontMatterVars) => {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === 'string' ? `"${value.replace(/"/g, '\\"')}"` : value
      }`,
  )
  .join('\n')}
---`;
  return yaml;
};
