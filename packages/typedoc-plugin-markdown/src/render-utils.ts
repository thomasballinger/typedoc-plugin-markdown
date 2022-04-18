import attemptExternalResolution from './resources/helpers/attemptExternalResolution';
import reflectionTitleHelper from './resources/helpers/reflection-title';
import relativeUrlHelper from './resources/helpers/relative-url';
import typeHelper from './resources/helpers/type';
import { MarkdownTheme } from './theme';

export function registerHelpers(theme: MarkdownTheme) {
  attemptExternalResolution(theme);
  reflectionTitleHelper(theme);
  relativeUrlHelper(theme);
  typeHelper();
}
