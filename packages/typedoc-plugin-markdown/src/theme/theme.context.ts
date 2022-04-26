import * as path from 'path';
import {
  Comment,
  DeclarationHierarchy,
  DeclarationReflection,
  PageEvent,
  ParameterReflection,
  ProjectReflection,
  ReferenceReflection,
  ReferenceType,
  Reflection,
  ReflectionGroup,
  SignatureReflection,
} from 'typedoc';
import { MarkdownTheme } from '.';
import { breadcrumbsPartial } from './partials/breadcrumbs/breadcrumbs.partial';
import { commentPartial } from './partials/comment/comment.partial';
import { declarationPartial } from './partials/declaration/declaration.partial';
import { hierarchyPartial } from './partials/hierarchy/hierarchy.partial';
import { indexSignaturePartial } from './partials/index-signature/index-signature.partial';
import { memberPartial } from './partials/member/member.partial';
import { membersPartial } from './partials/members.partial';
import { parameterTablePartial } from './partials/parameter-table.partial';
import { propertyTablePartial } from './partials/property-table.partial';
import { referencePartial } from './partials/reference.partial';
import { reflectionPathPartial } from './partials/reflection-path.partial';
import { reflectionTitlePartial } from './partials/reflection-title.partial';
import { signatureTitlePartial } from './partials/signature-title.partial';
import { signaturePartial } from './partials/signature.partial';
import { sourcesPartial } from './partials/sources.partial';
import { tocPartial } from './partials/toc.partial';
import { typeAndParentPartial } from './partials/type-and-parent.partial';
import { typeParameterTablePartial } from './partials/type-parameter-table.partial';
import { Collapse, typePartial } from './partials/type.partial';
import { memberTemplate } from './templates/member/member.template';
import { readmeTemplate } from './templates/readme/readme.template';
import { reflectionTemplate } from './templates/reflection/reflection.template';
import { TypedocPluginMarkdownOptions } from './theme.model';

/**
 * Provides theme context for theme resources, following the theming model of TypeDoc [DefaultThemeRenderContext](https://typedoc.org/api/classes/DefaultThemeRenderContext.html).
 *
 * The context is passed into theme templates and partials:
 *
 * - [Options](#properties-options) - exposed options of the renderer.
 * - [Templates](#properties-templates) - methods that pages are mapped to.
 * - [Partials](#properties-partials) - individual elements making up a page.
 */
export class MarkdownThemeRenderContext {
  public project: ProjectReflection;
  public activeLocation: string;
  public activeReflection: DeclarationReflection;
  public modulesFileName = 'modules.md';

  /**
   *
   * @param theme MarkdownTheme instance
   * @param options The options applied to the renderer
   */
  constructor(
    private theme: MarkdownTheme,
    public options: TypedocPluginMarkdownOptions,
  ) {}

  /**
   * The readme template, used when a readme is not available.
   * @category Templates
   */
  readmeTemplate = (props: PageEvent<ProjectReflection>) =>
    readmeTemplate(this, props);

  /**
   * The reflection template, used to describe main reflections.
   * @category Templates
   */
  reflectionTemplate = (
    props: PageEvent<ProjectReflection | DeclarationReflection>,
  ) => reflectionTemplate(this, props);

  /**
   * When allReflectionsHaveOwnDocument the template used for child members.
   * @category Templates
   */
  memberTemplate = (props: PageEvent<DeclarationReflection>) =>
    memberTemplate(this, props);

  /**
   * Renders the breadcrumb tree in page header.
   * @category Partials
   */
  breadcrumbsPartial = (
    props: PageEvent<ProjectReflection | DeclarationReflection>,
  ) => breadcrumbsPartial(this, props);

  /**
   * Converts a Comment model into comment text.
   * @category Partials
   */
  commentPartial = (props: Comment) => commentPartial(this, props);

  /**
   * Renders a declaration
   * @category Partials
   */
  declarationPartial = (props: DeclarationReflection) =>
    declarationPartial(this, props);

  /**
   * @category Partials
   */
  hierarchyPartial = (props: DeclarationHierarchy) =>
    hierarchyPartial(this, props);

  /**
   * @category Partials
   */
  indexSignaturePartial = (props: SignatureReflection) =>
    indexSignaturePartial(this, props);

  /**
   * @category Partials
   */
  memberPartial = (props: DeclarationReflection | ReferenceReflection) =>
    memberPartial(this, props);

  /**
   * @category Partials
   */
  membersPartial = (props: ReflectionGroup[]) => membersPartial(this, props);

  /**
   * @category Partials
   */
  parameterTablePartial = (props: ParameterReflection[]) =>
    parameterTablePartial(this, props);

  /**
   * @category Partials
   */
  propertyTablePartial = (props: DeclarationReflection[]) =>
    propertyTablePartial(this, props);

  /**
   * @category Partials
   */
  referencePartial = (props: ReferenceReflection) =>
    referencePartial(this, props);

  /**
   * @category Partials
   */
  reflectionPathPartial = (props: any) => reflectionPathPartial(this, props);

  /**
   * @category Partials
   */
  reflectionTitlePartial = (props: any, shouldEscape: boolean) =>
    reflectionTitlePartial(this, props, shouldEscape);

  /**
   * @category Partials
   */
  signaturePartial = (
    props: SignatureReflection,
    nested?: boolean,
    accessor?: string,
  ) => signaturePartial(this, props, nested, accessor);

  /**
   * @category Partials
   */
  signatureTitlePartial = (props: SignatureReflection, accessor?: string) =>
    signatureTitlePartial(this, props, accessor);

  /**
   * @category Partials
   */
  sourcesPartial = (props: DeclarationReflection | SignatureReflection) =>
    sourcesPartial(this, props);

  /**
   * @category Partials
   */
  tocPartial = (props: DeclarationReflection | ProjectReflection) =>
    tocPartial(this, props);

  /**
   * @category Partials
   */
  typePartial = (props: any, collapse?: Collapse, emphasis?: boolean) =>
    typePartial(this, props, collapse, emphasis);

  /**
   * @category Partials
   */
  typeAndParentPartial = (props: any) => typeAndParentPartial(this, props);

  /**
   * @category Partials
   */
  typeParameterTablePartial = (props: any) =>
    typeParameterTablePartial(this, props);

  /**
   * Transform the given absolute url path into a relative path.
   *
   * @param url  The path to transform.
   * @returns A path relative to the document currently processed.
   * @category Utilities
   */
  relativeURL = (url: string | undefined) => {
    if (!url) {
      return '';
    }

    if (/^(http|ftp)s?:\/\//.test(url)) {
      return url;
    }

    if (this.options.publicPath) {
      return this.options.publicPath + url;
    }

    const relative = path.relative(
      path.dirname(this.activeLocation),
      path.dirname(url),
    );

    return path.join(relative, path.basename(url)).replace(/\\/g, '/');
  };
  /**
   *
   * @param reflection
   * @returns
   * @category Utilities
   */

  urlTo = (reflection: Reflection) => this.relativeURL(reflection.url);

  /**
   *
   * @param type
   * @returns Resolved externals
   * @category Utilities
   */
  attemptExternalResolution = (type: ReferenceType) => {
    return this.theme.owner.attemptExternalResolution(type);
  };
}
