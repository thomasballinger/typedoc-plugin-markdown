import * as Handlebars from 'handlebars/runtime';
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

type Collapse = 'object' | 'function' | 'all' | 'none';

export const type = (
  context:
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
  if (context instanceof ReferenceType) {
    return getReferenceType(context, emphasis);
  }

  if (context instanceof ArrayType && context.elementType) {
    return getArrayType(context, emphasis);
  }

  if (context instanceof UnionType && context.types) {
    return getUnionType(context, emphasis);
  }

  if (context instanceof IntersectionType && context.types) {
    return getIntersectionType(context);
  }

  if (context instanceof TupleType && context.elements) {
    return getTupleType(context);
  }

  if (context instanceof IntrinsicType && context.name) {
    return getIntrinsicType(context, emphasis);
  }

  if (context instanceof ReflectionType) {
    return getReflectionType(context, collapse);
  }

  if (context instanceof DeclarationReflection) {
    return getReflectionType(context, collapse);
  }

  if (context instanceof TypeOperatorType) {
    return getTypeOperatorType(context);
  }

  if (context instanceof QueryType) {
    return getQueryType(context);
  }

  if (context instanceof ConditionalType) {
    return getConditionalType(context);
  }

  if (context instanceof IndexedAccessType) {
    return getIndexAccessType(context);
  }

  if (context instanceof UnknownType) {
    return getUnknownType(context);
  }

  if (context instanceof InferredType) {
    return getInferredType(context);
  }

  if (context instanceof LiteralType) {
    return getLiteralType(context);
  }

  return context ? Handlebars.helpers.escapeChars(context.toString()) : '';
};

//}

function getLiteralType(model: LiteralType) {
  if (typeof model.value === 'bigint') {
    return `\`${model.value}n\``;
  }
  return `\`\`${JSON.stringify(model.value)}\`\``;
}

export function getReflectionType(
  context: DeclarationReflection | ReflectionType,
  collapse: Collapse,
) {
  const root =
    context instanceof ReflectionType ? context.declaration : context;
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
      const obj = Handlebars.helpers.type(declarationIndexSignature.type);
      indexSignature = `${key}: ${obj}; `;
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `\`${obj.name}${
          obj.flags.isOptional ? '?' : ''
        }\`: ${Handlebars.helpers.type(
          obj.signatures || obj.children ? obj : obj.type,
        )} ${
          obj.defaultValue && obj.defaultValue !== '...'
            ? `= ${Handlebars.helpers.escapeChars(obj.defaultValue)}`
            : ''
        }`;
      });
    return `{ ${indexSignature ? indexSignature : ''}${
      types ? types.join('; ') : ''
    } }${
      model.defaultValue && model.defaultValue !== '...'
        ? `= ${Handlebars.helpers.escapeChars(model.defaultValue)}`
        : ''
    }`;
  }
  return '{}';
}

export function getFunctionType(modelSignatures: SignatureReflection[]) {
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
          }\`: ${Handlebars.helpers.type(param.type ? param.type : param)}`;
        })
      : [];
    const returns = Handlebars.helpers.type(fn.type);
    return typeParams + `(${params.join(', ')}) => ${returns}`;
  });
  return functions.join('');
}

function getReferenceType(model: ReferenceType, emphasis) {
  //const externalUrl = context.attemptExternalResolution(model);
  const externalUrl = false;
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = [];

    if (model.reflection?.url) {
      reflection.push(
        `[${`\`${model.reflection.name}\``}](${Handlebars.helpers.relativeURL(
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
          .map((typeArgument) => Handlebars.helpers.type(typeArgument))
          .join(', ')}\\>`,
      );
    }
    return reflection.join('');
  }
  return emphasis
    ? externalUrl
      ? `[${`\`${model.name}\``}]( ${externalUrl} )`
      : `\`${model.name}\``
    : Handlebars.helpers.escapeChars(model.name);
}

function getArrayType(model: ArrayType, emphasis: boolean) {
  const arrayType = Handlebars.helpers.type(
    model.elementType,
    'none',
    emphasis,
  );
  return model.elementType.type === 'union'
    ? `(${arrayType})[]`
    : `${arrayType}[]`;
}

function getUnionType(model: UnionType, emphasis: boolean) {
  return model.types
    .map((unionType) => Handlebars.helpers.type(unionType, 'none', emphasis))
    .join(` \\| `);
}

function getIntersectionType(model: IntersectionType) {
  return model.types
    .map((intersectionType) => Handlebars.helpers.type(intersectionType))
    .join(' & ');
}

function getTupleType(model: TupleType) {
  return `[${model.elements
    .map((element) => Handlebars.helpers.type(element))
    .join(', ')}]`;
}

function getIntrinsicType(model: IntrinsicType, emphasis: boolean) {
  return emphasis
    ? `\`${model.name}\``
    : Handlebars.helpers.escapeChars(model.name);
}

function getTypeOperatorType(model: TypeOperatorType) {
  return `${model.operator} ${Handlebars.helpers.type(model.target)}`;
}

function getQueryType(model: QueryType) {
  return `typeof ${Handlebars.helpers.type(model.queryType)}`;
}

function getInferredType(model: InferredType) {
  return `infer ${Handlebars.helpers.escapeChars(model.name)}`;
}

function getUnknownType(model: UnknownType) {
  return Handlebars.helpers.escapeChars(model.name);
}

function getConditionalType(model: ConditionalType) {
  const md: string[] = [];
  if (model.checkType) {
    md.push(Handlebars.helpers.type(model.checkType));
  }
  md.push('extends');
  if (model.extendsType) {
    md.push(Handlebars.helpers.type(model.extendsType));
  }
  md.push('?');
  if (model.trueType) {
    md.push(Handlebars.helpers.type(model.trueType));
  }
  md.push(':');
  if (model.falseType) {
    md.push(Handlebars.helpers.type(model.falseType));
  }
  return md.join(' ');
}

function getIndexAccessType(model: IndexedAccessType) {
  const md: string[] = [];
  if (model.objectType) {
    md.push(Handlebars.helpers.type(model.objectType));
  }
  if (model.indexType) {
    md.push(`[${Handlebars.helpers.type(model.indexType)}]`);
  }
  return md.join('');
}
