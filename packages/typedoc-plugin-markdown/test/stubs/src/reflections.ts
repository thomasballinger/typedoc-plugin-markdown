/**
 * Comments for ReflectionClass
 */
export class ReflectionClass {}

/**
 * Comments for CallableReflection
 */
export interface CallableReflection {
  (): string;
}

/**
 * Comments for EnumReflection
 */
export enum EnumReflection {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export class ImplementedClass implements ReflectionClass {}

export interface IndexableReflection {
  [index: number]: string;
}
