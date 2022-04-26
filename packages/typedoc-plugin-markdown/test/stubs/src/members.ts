export let declarationMember: string;

export function signatureMember() {}

export class ReferencedClass {}

export { ReferencedClass as ReferencedMember };

export class ClassWithAccessorMembers {
  private _private: string;

  get getter(): string {
    return this._private;
  }

  set setter(value: string) {
    this._private = value;
  }
}
