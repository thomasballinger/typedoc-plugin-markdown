import {
  DeclarationReflection,
  ParameterReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownThemeContext } from '../..';

export const symbolPartial = (
  context: MarkdownThemeContext,
  reflection: DeclarationReflection | ParameterReflection | SignatureReflection,
) => {
  const isStatic = reflection.flags && reflection.flags.isStatic;

  if (reflection.kind === ReflectionKind.CallSignature) {
    return '▸';
  }
  if (reflection.kind === ReflectionKind.TypeAlias) {
    return 'Ƭ';
  }
  if (reflection.kind === ReflectionKind.ObjectLiteral) {
    return '▪';
  }
  if (reflection.kind === ReflectionKind.Property && isStatic) {
    return '▪';
  }
  return '•';
};
