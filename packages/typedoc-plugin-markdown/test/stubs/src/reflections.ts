/**
 * comments
 */
export class ReflectionClass {}

export interface CallableReflection {
  (): string;
}

export enum EnumReflection {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export class ImplementedClass implements ReflectionClass {}
