import { createAction, handleActions, ActionsUnion, Handler } from './index';

describe('handleActions', () => {
  const ACTION = 'SOME_ACTION';
  const initialState = { foo: 'bar' };
  const returnedState = { foo: 'foo' };
  const actionHandler = jest.fn(() => returnedState);
  const reducer = handleActions(
    {
      [ACTION]: actionHandler,
    },
    initialState,
  );

  it('handles actions', () => {
    const action = { type: ACTION, error: false };

    const actual = reducer(initialState, action);

    expect(actual).toBe(returnedState);
    expect(actionHandler).toBeCalledWith(initialState, action);
  });

  it('returns state when action type is not handled', () => {
    const action = { type: 'other_action', error: false };
    const state = { foo: 'foo', error: false };

    const actual = reducer(state, action);

    expect(actual).toBe(state);
  });

  it('defaults to initialState when state is undefined', () => {
    const action = { type: ACTION, error: false };

    reducer(undefined, action);

    expect(actionHandler).toBeCalledWith(initialState, action);
  });

  it('returns initialState when state is undefined and action is not handled', () => {
    const actual = reducer(undefined, { type: '@@REDUX/INIT', error: false });

    expect(actual).toBe(initialState);
  });
});

describe('createAction', () => {
  it('creates an action with only type and error props', () => {
    const action = createAction('action-type');

    expect(action).toEqual({ type: 'action-type', error: false });
  });

  it('creates an action false error prop', () => {
    const action = createAction('action-type');

    expect(action.error).toBe(false);
  });

  it('creates an action with type, payload and error props', () => {
    const payload = { foo: 'bar' };
    const action = createAction('action-type', payload);

    expect(action).toEqual({ type: 'action-type', payload, error: false });
  });

  it('creates an action true error prop', () => {
    const payload = new Error('error');
    const action = createAction('action-type', payload);

    expect(action.error).toBe(true);
    expect(action).toEqual({ type: 'action-type', payload, error: true });
  });

  it('creates an action with type, payload, meta and error props', () => {
    const payload = { foo: 'bar' };
    const meta = { foo: 'bar' };
    const action = createAction('action-type', payload, meta);

    expect(action).toEqual({
      type: 'action-type',
      payload,
      meta,
      error: false,
    });
  });

  it('creates an action true error prop and meta', () => {
    const payload = new Error('error');
    const meta = { foo: 'bar' };
    const action = createAction('action-type', payload, meta);

    expect(action.error).toBe(true);
    expect(action).toEqual({
      type: 'action-type',
      payload,
      meta,
      error: true,
    });
  });
});

// type tests, all these should type check

interface State {
  foo: string;
}

const enum ActionTypes {
  foo = 'foo',
  bar = 'bar',
  baz = 'baz',
}

const Actions = {
  foo: () => createAction(ActionTypes.foo),
  bar: (s: string) => createAction(ActionTypes.bar, s),
  baz: (n: number) => createAction(ActionTypes.baz, n),
};
type Actions = ActionsUnion<typeof Actions>;

const handleBaz: Handler<State, ActionTypes.baz, Actions> = (
  s,
  { payload },
) => ({ foo: s.foo + payload.toString() });

const reducer = handleActions<State, ActionTypes, Actions>(
  {
    foo: () => ({ foo: 'foo' }),
    bar: (s, { payload }) => ({ foo: s.foo + payload }),
    baz: handleBaz,
  },
  { foo: 'bar' },
);
