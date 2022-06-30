import { 
 ArrayType,
 ConditionalType,
 ContainerReflection,
 Comment,
 CommentDisplayPart,
 DeclarationHierarchy,
 DeclarationReflection,
 InferredType,
 IntersectionType,
 IntrinsicType,
 IndexedAccessType,
 LiteralType,
 PageEvent,
 ParameterReflection,
 ProjectReflection,
 QueryType,
 ReflectionGroup,
 ReferenceReflection,
 ReferenceType,
 ReflectionType,
 Reflection,
 SignatureReflection,
 SomeType,
 TupleType,
 TypeOperatorType,
 TypeParameterReflection,
 UnionType,
 UnknownType } from 'typedoc';

import { MarkdownThemeRenderContext } from './theme-context';
import { Collapse } from './models';
import { project } from './templates/project';
import { readme } from './templates/readm3';
import { reflection } from './templates/reflection';
import { breadcrumbs } from './partials/breadcrumbs';
import { commentParts } from './partials/comment.parts';
import { comment } from './partials/comment';
import { hierarchy } from './partials/hierarchy';
import { declarationTitle } from './partials/member.declaration.title';
import { declaration } from './partials/member.declaration';
import { sources } from './partials/member.sources';
import { member } from './partials/member';
import { memberReference } from './partials/memberReference';
import { members } from './partials/members';
import { membersGroup } from './partials/membersGroup';
import { memberSignature } from './partials/memberSignature';
import { parameterTable } from './partials/parameterTable';
import { propertyTable } from './partials/propertyTable';
import { reflectionTitle } from './partials/reflectionTitle';
import { toc } from './partials/toc';
import { arrayType } from './partials/type.array';
import { conditionalType } from './partials/type.conditional';
import { declarationType } from './partials/type.declaration';
import { functionType } from './partials/type.function';
import { indexAccessType } from './partials/type.indexAccess';
import { inferredType } from './partials/type.inferred';
import { intersectionType } from './partials/type.intersection';
import { intrinsicType } from './partials/type.intrinsic';
import { literalType } from './partials/type.literal';
import { queryType } from './partials/type.query';
import { referenceType } from './partials/type.reference';
import { reflectionType } from './partials/type.reflection';
import { someType } from './partials/type.some';
import { tupleType } from './partials/type.tuple';
import { typeOperatorType } from './partials/type.typeOperator';
import { unionType } from './partials/type.union';
import { unknownType } from './partials/type.unknown';
import { typeParameters } from './partials/typeParameters';
import { typeParameterTable } from './partials/typeParameterTable';

function bind<F, L extends any[], R>(fn: (f: F, ...a: L) => R, first: F) {
  return (...r: L) => fn(first, ...r);
}
export type Templates = {
  project: (page: PageEvent<ProjectReflection>) => string;
  readme: (page: PageEvent<ProjectReflection>) => string;
  reflection: (page: PageEvent<DeclarationReflection>) => string;
};

export type Partials = {
  breadcrumbs: (page: PageEvent<ProjectReflection | DeclarationReflection>) => string;
  commentParts: (parts: CommentDisplayPart[]) => string;
  comment: (comment: Comment) => string;
  hierarchy: (declarationHierarchy: DeclarationHierarchy) => string;
  declarationTitle: (reflection: DeclarationReflection | ParameterReflection) => string;
  declaration: (reflection: DeclarationReflection) => string;
  sources: (reflection: DeclarationReflection | SignatureReflection) => string;
  member: (props: DeclarationReflection) => string;
  memberReference: (props: ReferenceReflection) => string;
  members: (props: ContainerReflection) => string;
  membersGroup: (group: ReflectionGroup) => string;
  memberSignature: (props: SignatureReflection, nested?: boolean, accessor?: string |  undefined) => string;
  parameterTable: (parameters: ParameterReflection[]) => string;
  propertyTable: (props: DeclarationReflection[]) => string;
  reflectionTitle: (declarationReflection: DeclarationReflection, shouldEscape?: boolean) => string;
  toc: (props: ProjectReflection | DeclarationReflection) => string;
  arrayType: (arrayType: ArrayType, emphasis: boolean) => string;
  conditionalType: (conditionalType: ConditionalType) => string;
  declarationType: (declarationReflection: DeclarationReflection, collapse?: Collapse) => string;
  functionType: (modelSignatures: SignatureReflection[]) => string;
  indexAccessType: (model: IndexedAccessType) => string;
  inferredType: (model: InferredType) => string;
  intersectionType: (model: IntersectionType) => string;
  intrinsicType: (model: IntrinsicType, emphasis: boolean) => string;
  literalType: (literalType: LiteralType) => string;
  queryType: (queryType: QueryType) => string;
  referenceType: (referenceType: ReferenceType, emphasis: boolean) => string;
  reflectionType: (reflectionType: ReflectionType, collapse: Collapse) => string;
  someType: (someType: SomeType, collapse?: Collapse, emphasis?: boolean) => string;
  tupleType: (tupleType: TupleType) => string;
  typeOperatorType: (model: TypeOperatorType) => string;
  unionType: (unionType: UnionType, emphasis: boolean) => string;
  unknownType: (model: UnknownType) => string;
  typeParameters: (typeParameters: TypeParameterReflection[]) => string;
  typeParameterTable: (props: TypeParameterReflection[]) => string;
};

export const templates = (context: MarkdownThemeRenderContext): Templates => ({
  project: bind(project, context),
  readme: bind(readme, context),
  reflection: bind(reflection, context),
});

export const partials = (context: MarkdownThemeRenderContext): Partials => ({
  breadcrumbs: bind(breadcrumbs, context),
  commentParts: bind(commentParts, context),
  comment: bind(comment, context),
  hierarchy: bind(hierarchy, context),
  declarationTitle: bind(declarationTitle, context),
  declaration: bind(declaration, context),
  sources: bind(sources, context),
  member: bind(member, context),
  memberReference: bind(memberReference, context),
  members: bind(members, context),
  membersGroup: bind(membersGroup, context),
  memberSignature: bind(memberSignature, context),
  parameterTable: bind(parameterTable, context),
  propertyTable: bind(propertyTable, context),
  reflectionTitle: bind(reflectionTitle, context),
  toc: bind(toc, context),
  arrayType: bind(arrayType, context),
  conditionalType: bind(conditionalType, context),
  declarationType: bind(declarationType, context),
  functionType: bind(functionType, context),
  indexAccessType: bind(indexAccessType, context),
  inferredType: bind(inferredType, context),
  intersectionType: bind(intersectionType, context),
  intrinsicType: bind(intrinsicType, context),
  literalType: bind(literalType, context),
  queryType: bind(queryType, context),
  referenceType: bind(referenceType, context),
  reflectionType: bind(reflectionType, context),
  someType: bind(someType, context),
  tupleType: bind(tupleType, context),
  typeOperatorType: bind(typeOperatorType, context),
  unionType: bind(unionType, context),
  unknownType: bind(unknownType, context),
  typeParameters: bind(typeParameters, context),
  typeParameterTable: bind(typeParameterTable, context),
});