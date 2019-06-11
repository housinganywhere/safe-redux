export { BindAction } from './utils';
import { AnyFunction, StringMap } from './utils';

// We use conditional types so we can have only one type for defining Action
export type Action<
  T extends string = string,
  P = void,
  M = void
> = P extends void
  ? M extends void
    ? Readonly<{ type: T; error: boolean }>
    : Readonly<{ type: T; meta: M; error: boolean }>
  : M extends void
  ? Readonly<{ type: T; payload: P; error: boolean }>
  : Readonly<{ type: T; payload: P; meta: M; error: boolean }>;

export type ActionsUnion<A extends StringMap<AnyFunction>> = ReturnType<
  A[keyof A]
>;

// conditional type for filtering actions in epics/effects
export type ActionsOfType<
  ActionUnion,
  ActionType extends string
> = ActionUnion extends Action<ActionType> ? ActionUnion : never;

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
  type: T,
  payload: P,
): Action<T, P>;
export function createAction<T extends string, P, M>(
  type: T,
  payload: P,
  meta: M,
): Action<T, P, M>;
export function createAction<T extends string, P, M>(
  type: T,
  payload?: P,
  meta?: M,
) {
  return payload === undefined
    ? meta === undefined
      ? { type, error: false }
      : { type, meta, error: false }
    : meta === undefined
    ? { type, payload, error: payload instanceof Error }
    : { type, payload, meta, error: payload instanceof Error };
}

export function handleActions<
  State,
  Types extends string,
  Actions extends ActionsUnion<{ [T in Types]: AnyFunction }>
>(
  handler: {
    [T in Types]: (state: State, action: ActionsOfType<Actions, T>) => State;
  },
  initialState: State,
) {
  return (state = initialState, action: Actions): State =>
    handler[action.type] ? handler[action.type](state, action) : state;
}
