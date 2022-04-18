import reflectionTitleHelper from './resources/helpers/reflection-title';
import { MarkdownTheme } from './theme';

export function registerHelpers(theme: MarkdownTheme) {
  reflectionTitleHelper(theme);
}
