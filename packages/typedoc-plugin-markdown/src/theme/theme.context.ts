import {
  Comment,
  DeclarationHierarchy,
  DeclarationReflection,
  Options,
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
import { breadcrumbsPartial } from './resources/partials/breadcrumbs.partial';
import { commentPartial } from './resources/partials/comment.partial';
import { declarationTitlePartial } from './resources/partials/declaration-title.partial';
import { declarationPartial } from './resources/partials/declaration.partial';
import { groupsPartial } from './resources/partials/groups.partial';
import { hierarchyPartial } from './resources/partials/hierarchy.partial';
import { indexSignatureTitlePartial } from './resources/partials/index-signature-title.partial';
import { memberPartial } from './resources/partials/member.partial';
import { parameterTablePartial } from './resources/partials/parameter-table.partial';
import { propertyTablePartial } from './resources/partials/property-table.partial';
import { referencePartial } from './resources/partials/reference.partial';
import { reflectionPathPartial } from './resources/partials/reflection-path.partial';
import { reflectionTitlePartial } from './resources/partials/reflection-title.partial';
import { signatureTitlePartial } from './resources/partials/signature-title.partial';
import { signaturePartial } from './resources/partials/signature.partial';
import { sourcesPartial } from './resources/partials/sources.partial';
import { tocPartial } from './resources/partials/toc.partial';
import { typeAndParentPartial } from './resources/partials/type-and-parent.partial';
import { typeParameterTablePartial } from './resources/partials/type-parameter-table.partial';
import { Collapse, typePartial } from './resources/partials/type.partial';
import { indexTemplate } from './resources/templates/index.template';
import { memberTemplate } from './resources/templates/member.template';
import { readmeTemplate } from './resources/templates/readme.template';
import { reflectionTemplate } from './resources/templates/reflection.template';

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
  /**
   * The options applied to the renderer.
   */
  options: Record<string, any>;

  /**
   * The index template mapped to entry point of a document
   *
   * @category Templates
   */
  indexTemplate = (props: PageEvent<ProjectReflection>) =>
    indexTemplate(this, props);

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
  reflectionTemplate = (props: PageEvent<DeclarationReflection>) =>
    reflectionTemplate(this, props);

  /**
   * When allReflectionsHaveOwnDocument the template used for child members.
   * @category Templates
   */
  memberTemplate = (props: PageEvent<DeclarationReflection>) =>
    memberTemplate(this, props);

  /**
   * The breadcrumbs partial used to display a breadcrumb tree.
   * @category Partials
   */
  breadcrumbsPartial = (
    props: PageEvent<ProjectReflection | DeclarationReflection>,
  ) => breadcrumbsPartial(this, props);

  /**
   * The title of declarations.
   * @category Partials
   */
  declarationTitlePartial = (
    props: ParameterReflection | DeclarationReflection,
  ) => declarationTitlePartial(this, props);

  /**
   * @category Partials
   */
  declarationPartial = (props: DeclarationReflection) =>
    declarationPartial(this, props);

  /**
   * @category Partials
   */
  commentPartial = (props: Comment) => commentPartial(this, props);

  /**
   * @category Partials
   */
  groupsPartial = (props: ReflectionGroup[]) => groupsPartial(this, props);

  /**
   * @category Partials
   */
  hierarchyPartial = (props: DeclarationHierarchy) =>
    hierarchyPartial(this, props);

  /**
   * @category Partials
   */
  indexSignatureTitlePartial = (props: SignatureReflection) =>
    indexSignatureTitlePartial(this, props);

  /**
   * @category Partials
   */
  memberPartial = (props: DeclarationReflection | ReferenceReflection) =>
    memberPartial(this, props);

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

  constructor(private theme: MarkdownTheme, options: Options) {
    this.options = options.getRawValues() as Record<string, any>;
  }

  relativeURL = (url: string | undefined) => this.theme.getRelativeUrl(url);

  urlTo = (reflection: Reflection) => this.theme.getRelativeUrl(reflection.url);

  attemptExternalResolution = (type: ReferenceType) => {
    return this.theme.owner.attemptExternalResolution(type);
  };
}
