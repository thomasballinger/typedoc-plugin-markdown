import attemptExternalResolution from './resources/helpers/attemptExternalResolution';
import commentHelper from './resources/helpers/comment';
import commentsHelper from './resources/helpers/comments';
import hierarchyHelper from './resources/helpers/hierarchy';
import indexSignatureTitleHelper from './resources/helpers/index-signature-title';
import parameterTableHelper from './resources/helpers/parameter-table';
import reflectionTitleHelper from './resources/helpers/reflection-title';
import relativeUrlHelper from './resources/helpers/relative-url';
import typeHelper from './resources/helpers/type';
import { MarkdownTheme } from './theme';

export function registerHelpers(theme: MarkdownTheme) {
  attemptExternalResolution(theme);
  commentHelper(theme);
  commentsHelper();
  hierarchyHelper();
  indexSignatureTitleHelper();
  parameterTableHelper();
  reflectionTitleHelper(theme);
  relativeUrlHelper(theme);
  typeHelper();
}
