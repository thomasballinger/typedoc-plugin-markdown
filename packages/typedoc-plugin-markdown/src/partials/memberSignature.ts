import {
  DeclarationReflection,
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
  SomeType,
} from 'typedoc';
import { heading } from '../els';
import { MarkdownThemeRenderContext } from '../theme-context';

export function memberSignature(
  context: MarkdownThemeRenderContext,
  props: SignatureReflection,
  nested = false,
  accessor?: string,
) {
  const md: string[] = [];

  const typeDeclaration = (props.type as any)
    ?.declaration as DeclarationReflection;

  md.push(signatureTitle(context, props, accessor));

  if (props.comment) {
    md.push(context.partials.comment(props.comment));
  }

  if (props.typeParameters?.length) {
    md.push(heading(nested ? 5 : 4, 'Type parameters'));
    md.push(context.partials.typeParameterTable(props.typeParameters));
  }

  if (props.parameters?.length) {
    md.push(heading(nested ? 5 : 4, 'Parameters'));
    md.push(context.partials.parameterTable(props.parameters));
  }

  if (props.type && !props.parent?.kindOf(ReflectionKind.Constructor)) {
    if (props.type) {
      md.push(heading(nested ? 5 : 4, 'Returns'));
      md.push(context.partials.someType(props.type, 'all'));
      // if (props.comment?.returns) {
      //  md.push(props.comment.returns);
      // }
    }

    if (typeDeclaration?.signatures) {
      typeDeclaration.signatures.forEach((signature) => {
        md.push(context.partials.memberSignature(signature, true));
      });
    }

    if (typeDeclaration?.children) {
      md.push(context.partials.propertyTable(typeDeclaration.children));
    }
  }

  if (!nested) {
    md.push(context.partials.sources(props));
  }

  return md.join('\n\n');
}

const signatureTitle = (
  context: MarkdownThemeRenderContext,
  props: SignatureReflection,
  accessor?: string,
) => {
  const md: string[] = [];

  if (props.parent && props.parent.flags?.length > 0) {
    md.push(props.parent.flags.map((flag) => `\`${flag}\``).join(' ') + ' ');
  }

  if (accessor) {
    md.push(`\`${accessor}\` **${props.name}**`);
  } else if (props.name !== '__call' && props.name !== '__type') {
    md.push(`**${props.name}**`);
  }

  if (props.typeParameters) {
    md.push(
      `<${props.typeParameters
        .map((typeParameter) => `\`${typeParameter.name}\``)
        .join(', ')}\\>`,
    );
  }

  const getParameters = (parameters: ParameterReflection[] = []) => {
    return parameters
      .map((param) => {
        const paramsmd: string[] = [];
        if (param.flags.isRest) {
          paramsmd.push('...');
        }
        const paramItem = `\`${param.name}${
          param.flags.isOptional || param.defaultValue ? '?' : ''
        }\`: ${context.partials.someType(param.type as SomeType, 'all')}`;
        paramsmd.push(paramItem);
        return paramsmd.join('');
      })
      .join(', ');
  };

  md.push(`(${getParameters(props.parameters)})`);

  if (props.type && !props.parent?.kindOf(ReflectionKind.Constructor)) {
    md.push(`: ${context.partials.someType(props.type, 'object')}`);
  }
  return md.join('');
};
