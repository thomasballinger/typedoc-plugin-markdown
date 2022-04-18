import attemptExternalResolution from './resources/helpers/attemptExternalResolution';
import commentHelper from './resources/helpers/comment';
import commentsHelper from './resources/helpers/comments';
import reflectionTitleHelper from './resources/helpers/reflection-title';
import relativeUrlHelper from './resources/helpers/relative-url';
import typeHelper from './resources/helpers/type';
import { MarkdownTheme } from './theme';

export function registerHelpers(theme: MarkdownTheme) {
  attemptExternalResolution(theme);
  commentHelper(theme);
  commentsHelper();
  reflectionTitleHelper(theme);
  relativeUrlHelper(theme);
  typeHelper();
}
