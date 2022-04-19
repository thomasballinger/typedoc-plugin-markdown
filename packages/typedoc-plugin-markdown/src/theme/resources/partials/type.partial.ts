import {
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  PredicateType,
  QueryType,
  ReferenceType,
  ReflectionType,
  SignatureReflection,
  TupleType,
  TypeOperatorType,
  UnionType,
  UnknownType,
} from 'typedoc';
import { escapeChars } from '../../../utils/format';
import { MarkdownThemeRenderContext } from '../../theme.context';

export type Collapse = 'object' | 'function' | 'all' | 'none';

export function typePartial(
  context: MarkdownThemeRenderContext,
  theType:
    | ArrayType
    | IntersectionType
    | IntrinsicType
    | ReferenceType
    | TupleType
    | UnionType
    | TypeOperatorType
    | QueryType
    | PredicateType
    | ReferenceType
    | ConditionalType
    | IndexedAccessType
    | UnknownType
    | InferredType,

  collapse: Collapse = 'none',
  emphasis = true,
) {
  if (theType instanceof ReferenceType) {
    return getReferenceType(theType, emphasis);
  }

  if (theType instanceof ArrayType && theType.elementType) {
    return getArrayType(theType, emphasis);
  }

  if (theType instanceof UnionType && theType.types) {
    return getUnionType(theType, emphasis);
  }

  if (theType instanceof IntersectionType && theType.types) {
    return getIntersectionType(theType);
  }

  if (theType instanceof TupleType && theType.elements) {
    return getTupleType(theType);
  }

  if (theType instanceof IntrinsicType && theType.name) {
    return getIntrinsicType(theType, emphasis);
  }

  if (theType instanceof ReflectionType) {
    return getReflectionType(theType, collapse);
  }

  if (theType instanceof DeclarationReflection) {
    return getReflectionType(theType, collapse);
  }

  if (theType instanceof TypeOperatorType) {
    return getTypeOperatorType(theType);
  }

  if (theType instanceof QueryType) {
    return getQueryType(theType);
  }

  if (theType instanceof ConditionalType) {
    return getConditionalType(theType);
  }

  if (theType instanceof IndexedAccessType) {
    return getIndexAccessType(theType);
  }

  if (theType instanceof UnknownType) {
    return getUnknownType(theType);
  }

  if (theType instanceof InferredType) {
    return getInferredType(theType);
  }

  if (theType instanceof LiteralType) {
    return getLiteralType(theType);
  }

  function getLiteralType(model: LiteralType) {
    if (typeof model.value === 'bigint') {
      return `\`${model.value}n\``;
    }
    return `\`\`${JSON.stringify(model.value)}\`\``;
  }

  function getReflectionType(
    model: DeclarationReflection | ReflectionType,
    collapse: Collapse,
  ) {
    const root = model instanceof ReflectionType ? model.declaration : model;
    if (root.signatures) {
      return collapse === 'function' || collapse === 'all'
        ? `\`fn\``
        : getFunctionType(root.signatures);
    }
    return collapse === 'object' || collapse === 'all'
      ? `\`Object\``
      : getDeclarationType(root);
  }

  function getDeclarationType(model: DeclarationReflection) {
    if (model.indexSignature || model.children) {
      let indexSignature = '';
      const declarationIndexSignature = model.indexSignature;
      if (declarationIndexSignature) {
        const key = declarationIndexSignature.parameters
          ? declarationIndexSignature.parameters.map(
              (param) => `\`[${param.name}: ${param.type}]\``,
            )
          : '';
        const obj = context.typePartial(declarationIndexSignature.type);
        indexSignature = `${key}: ${obj}; `;
      }
      const types =
        model.children &&
        model.children.map((obj) => {
          return `\`${obj.name}${
            obj.flags.isOptional ? '?' : ''
          }\`: ${context.typePartial(
            obj.signatures || obj.children ? obj : obj.type,
          )} ${
            obj.defaultValue && obj.defaultValue !== '...'
              ? `= ${escapeChars(obj.defaultValue)}`
              : ''
          }`;
        });
      return `{ ${indexSignature ? indexSignature : ''}${
        types ? types.join('; ') : ''
      } }${
        model.defaultValue && model.defaultValue !== '...'
          ? `= ${escapeChars(model.defaultValue)}`
          : ''
      }`;
    }
    return '{}';
  }

  function getFunctionType(modelSignatures: SignatureReflection[]) {
    const functions = modelSignatures.map((fn) => {
      const typeParams = fn.typeParameters
        ? `<${fn.typeParameters
            .map((typeParameter) => typeParameter.name)
            .join(', ')}\\>`
        : [];
      const params = fn.parameters
        ? fn.parameters.map((param) => {
            return `${param.flags.isRest ? '...' : ''}\`${param.name}${
              param.flags.isOptional ? '?' : ''
            }\`: ${context.typePartial(param.type ? param.type : param)}`;
          })
        : [];
      const returns = context.typePartial(fn.type);
      return typeParams + `(${params.join(', ')}) => ${returns}`;
    });
    return functions.join('');
  }

  function getReferenceType(model: ReferenceType, emphasis: boolean) {
    const externalUrl = context.attemptExternalResolution(model);
    if (model.reflection || (model.name && model.typeArguments)) {
      const reflection: string[] = [];

      if (model.reflection?.url) {
        reflection.push(
          `[${`\`${model.reflection.name}\``}](${context.relativeURL(
            model.reflection.url,
          )})`,
        );
      } else {
        reflection.push(
          externalUrl
            ? `[${`\`${model.name}\``}]( ${externalUrl} )`
            : `\`${model.name}\``,
        );
      }
      if (model.typeArguments && model.typeArguments.length > 0) {
        reflection.push(
          `<${model.typeArguments
            .map((typeArgument) => context.typePartial(typeArgument))
            .join(', ')}\\>`,
        );
      }
      return reflection.join('');
    }
    return emphasis
      ? externalUrl
        ? `[${`\`${model.name}\``}]( ${externalUrl} )`
        : `\`${model.name}\``
      : escapeChars(model.name);
  }

  function getArrayType(model: ArrayType, emphasis: boolean) {
    const arrayType = context.typePartial(model.elementType, 'none', emphasis);
    return model.elementType.type === 'union'
      ? `(${arrayType})[]`
      : `${arrayType}[]`;
  }

  function getUnionType(model: UnionType, emphasis: boolean) {
    return model.types
      .map((unionType) => context.typePartial(unionType, 'none', emphasis))
      .join(` \\| `);
  }

  function getIntersectionType(model: IntersectionType) {
    return model.types
      .map((intersectionType) => context.typePartial(intersectionType))
      .join(' & ');
  }

  function getTupleType(model: TupleType) {
    return `[${model.elements
      .map((element) => context.typePartial(element))
      .join(', ')}]`;
  }

  function getIntrinsicType(model: IntrinsicType, emphasis: boolean) {
    return emphasis ? `\`${model.name}\`` : escapeChars(model.name);
  }

  function getTypeOperatorType(model: TypeOperatorType) {
    return `${model.operator} ${context.typePartial(model.target)}`;
  }

  function getQueryType(model: QueryType) {
    return `typeof ${context.typePartial(model.queryType)}`;
  }

  function getInferredType(model: InferredType) {
    return `infer ${escapeChars(model.name)}`;
  }

  function getUnknownType(model: UnknownType) {
    return escapeChars(model.name);
  }

  function getConditionalType(model: ConditionalType) {
    const md: string[] = [];
    if (model.checkType) {
      md.push(context.typePartial(model.checkType));
    }
    md.push('extends');
    if (model.extendsType) {
      md.push(context.typePartial(model.extendsType));
    }
    md.push('?');
    if (model.trueType) {
      md.push(context.typePartial(model.trueType));
    }
    md.push(':');
    if (model.falseType) {
      md.push(context.typePartial(model.falseType));
    }
    return md.join(' ');
  }

  function getIndexAccessType(model: IndexedAccessType) {
    const md: string[] = [];
    if (model.objectType) {
      md.push(context.typePartial(model.objectType));
    }
    if (model.indexType) {
      md.push(`[${context.typePartial(model.indexType)}]`);
    }
    return md.join('');
  }

  return theType ? escapeChars(theType.toString()) : '';
}
