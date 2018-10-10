import { createAction, handleActions } from './index';

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

  it('should handle actions', () => {
    const action = { type: ACTION };

    const actual = reducer(initialState, action);

    expect(actual).toBe(returnedState);
    expect(actionHandler).toBeCalledWith(initialState, action);
  });

  it('should return state when action type is not handled', () => {
    const action = { type: 'other_action' };
    const state = { foo: 'foo' };

    const actual = reducer(state, action);

    expect(actual).toBe(state);
  });

  it('should default to initialState when state is undefined', () => {
    const action = { type: ACTION };

    reducer(undefined, action);

    expect(actionHandler).toBeCalledWith(initialState, action);
  });

  it('should return initialState when state is undefined and action is not handled', () => {
    const actual = reducer(undefined, { type: '@@REDUX/INIT' });

    expect(actual).toBe(initialState);
  });
});

describe('createAction', () => {
  it('should create an action with only type and error props', () => {
    const action = createAction('action-type');

    expect(action).toEqual({ type: 'action-type', error: false });
  });

  it('should create an action false error prop', () => {
    const action = createAction('action-type');

    expect(action.error).toBe(false);
  });

  it('should create an action with type, payload and error props', () => {
    const payload = { foo: 'bar' };
    const action = createAction('action-type', payload);

    expect(action).toEqual({ type: 'action-type', payload, error: false });
  });

  it('should create an action true error prop', () => {
    const payload = new Error('error');
    const action = createAction('action-type', payload);

    expect(action.error).toBe(true);
    expect(action).toEqual({ type: 'action-type', payload, error: true });
  });

  it('should create an action with type, payload, meta and error props', () => {
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

  it('should create an action true error prop and meta', () => {
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
