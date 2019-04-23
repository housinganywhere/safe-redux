// tslint:disable no-any
type ChangeReturnType<F, R> = F extends () => any
  ? () => R
  : F extends (arg: infer A) => any
  ? (arg: A) => R
  : F extends (arg1: infer A, arg2: infer B) => any
  ? (arg1: A, arg2: B) => R
  : F extends (arg1: infer A, arg2: infer B, arg3: infer C) => any
  ? (arg1: A, arg2: B, arg3: C) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
    ) => any
  ? (arg1: A, arg2: B, arg3: C, arg4: D) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
      arg5: infer E,
    ) => any
  ? (arg1: A, arg2: B, arg3: C, arg4: E, arg5: D) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
      arg5: infer E,
      arg6: infer F,
    ) => any
  ? (arg1: A, arg2: B, arg3: C, arg4: D, arg5: E, arg6: F) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
      arg5: infer E,
      arg6: infer F,
      arg7: infer G,
    ) => any
  ? (arg1: A, arg2: B, arg3: C, arg4: D, arg5: E, arg6: F, arg7: G) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
      arg5: infer E,
      arg6: infer F,
      arg7: infer G,
      arg8: infer H,
    ) => any
  ? (
      arg1: A,
      arg2: B,
      arg3: C,
      arg4: D,
      arg5: E,
      arg6: F,
      arg7: G,
      arg8: H,
    ) => R
  : F extends (
      arg1: infer A,
      arg2: infer B,
      arg3: infer C,
      arg4: infer D,
      arg5: infer E,
      arg6: infer F,
      arg7: infer G,
      arg8: infer H,
      arg9: infer I,
    ) => any
  ? (
      arg1: A,
      arg2: B,
      arg3: C,
      arg4: D,
      arg5: E,
      arg6: F,
      arg7: G,
      arg8: H,
      arg9: I,
    ) => R
  : never;

export type AnyFunction = (...args: any[]) => any;

// tslint:enable no-any

// use case example:
// @link http://bit.ly/2KSnhEK
export type BindAction<A> = ChangeReturnType<A, void>;

export interface StringMap<T> {
  [key: string]: T;
}
