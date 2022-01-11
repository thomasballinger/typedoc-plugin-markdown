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
import { MarkdownThemeContext } from '../../theme-context';
import { escapeChars } from '../../utils/format';

type Collapse = 'object' | 'function' | 'all' | 'none';

export const typePartial = (
  context: MarkdownThemeContext,
  props:
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
) => {
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
      return getFunctionType(root.signatures, collapse);
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
              (param) => `[${param.name}: ${param.type}]`,
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

  function getFunctionType(
    modelSignatures: SignatureReflection[],
    collapse: Collapse,
  ) {
    if (collapse === 'function' || collapse === 'all') {
      return `\`fn\``;
    }
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
          `[${`\`${model.reflection.name}\``}](${context.urlTo(
            model.reflection,
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

  if (props instanceof ReferenceType) {
    return getReferenceType(props, emphasis);
  }

  if (props instanceof ArrayType && props.elementType) {
    return getArrayType(props, emphasis);
  }

  if (props instanceof UnionType && props.types) {
    return getUnionType(props, emphasis);
  }

  if (props instanceof IntersectionType && props.types) {
    return getIntersectionType(props);
  }

  if (props instanceof TupleType && props.elements) {
    return getTupleType(props);
  }

  if (props instanceof IntrinsicType && props.name) {
    return getIntrinsicType(props, emphasis);
  }

  if (props instanceof ReflectionType) {
    return getReflectionType(props, collapse);
  }

  if (props instanceof DeclarationReflection) {
    return getReflectionType(props, collapse);
  }

  if (props instanceof Array && props[0] instanceof SignatureReflection) {
    return getFunctionType(props, collapse);
  }

  if (props instanceof TypeOperatorType) {
    return getTypeOperatorType(props);
  }

  if (props instanceof QueryType) {
    return getQueryType(props);
  }

  if (props instanceof ConditionalType) {
    return getConditionalType(props);
  }

  if (props instanceof IndexedAccessType) {
    return getIndexAccessType(props);
  }

  if (props instanceof UnknownType) {
    return getUnknownType(props);
  }

  if (props instanceof InferredType) {
    return getInferredType(props);
  }

  if (props instanceof LiteralType) {
    return getLiteralType(props);
  }

  return props ? escapeChars(props.toString()) : '';
};
