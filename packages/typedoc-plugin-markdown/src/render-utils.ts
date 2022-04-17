import attemptExternalResolution from './resources/helpers/attemptExternalResolution';
import commentHelper from './resources/helpers/comment';
import commentsHelper from './resources/helpers/comments';
import hierarchyHelper from './resources/helpers/hierarchy';
import indexSignatureTitleHelper from './resources/helpers/index-signature-title';
import parameterTableHelper from './resources/helpers/parameter-table';
import propertyTableHelper from './resources/helpers/property-table';
import referenceMember from './resources/helpers/reference-member';
import reflectionPathHelper from './resources/helpers/reflection-path';
import reflectionTitleHelper from './resources/helpers/reflection-title';
import relativeUrlHelper from './resources/helpers/relative-url';
import signatureTitleHelper from './resources/helpers/signature-title';
import tocHelper from './resources/helpers/toc';
import typeHelper from './resources/helpers/type';
import typeAndParentHelper from './resources/helpers/type-and-parent';
import typeParameterTableHelper from './resources/helpers/type-parameter-table';
import { MarkdownTheme } from './theme';

export function registerHelpers(theme: MarkdownTheme) {
  attemptExternalResolution(theme);
  commentHelper(theme);
  commentsHelper();
  hierarchyHelper();
  indexSignatureTitleHelper();
  parameterTableHelper();
  propertyTableHelper();
  referenceMember();
  reflectionPathHelper();
  reflectionTitleHelper(theme);
  relativeUrlHelper(theme);
  signatureTitleHelper(theme);
  tocHelper(theme);
  typeHelper();
  typeAndParentHelper();
  typeParameterTableHelper();
}
