# safe-redux :evergreen_tree:

[![npm version](https://badge.fury.io/js/%40housinganywhere%2Fsafe-redux.svg)](https://badge.fury.io/js/%40housinganywhere%2Fsafe-redux)
[![CircleCI](https://circleci.com/gh/housinganywhere/safe-redux.svg?style=svg)](https://circleci.com/gh/housinganywhere/safe-redux)

**NOTE**: this library is based on [@martin_hotell](https://github.com/Hotell)'s
[rex-tils](https://github.com/Hotell/rex-tils) library and his article
[_Improved Redux type safety with TypeScript 2.8_](https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575).

> Instead of telling the program what types it should use, types are inferred
> from the implementation, so type checker gets out of our way!
>
> [_Improved Redux type safety with TypeScript 2.8_](https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575)

## Install

```
yarn add @housinganywhere/safe-redux

npm i @housinganywhere/safe-redux
```

## Use

Define the actions:

```ts
// src/pages/MyPage/actions.ts

import { ActionsUnion, createAction } from '@housinganywhere/safe-redux';

export const INC = '[counter] increment';
export const DEC = '[counter] decrement';
export const INC_BY = '[counter] increment_by';
export const WITH_META = '[counter] with_meta';

export const Actions = {
  inc: () => createAction(INC),
  dec: () => createAction(DEC),
  incBY: (by: number) => createAction(INC_BY, by),
  withMeta: (by: number, meta: string) => createAction(WITH_META, by, meta),
};

export type Actions = ActionsUnion<typeof Actions>;

export type ActionTypes =
  | typeof INC
  | typeof DEC
  | typeof INC_BY
  | typeof WITH_META;
```

Handle the actions:

```ts
// src/pages/MyPage/reducer.ts

import { handleActions } from '@housinganywhere/safe-redux';

import { User } from '../types';

import { INC, DEC, INC_BY, WITH_META, Actions, ActionTypes } from './actions';

interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

const reducer = handleActions<State, ActionTypes, Actions>(
  {
    [INC]: ({ count }) => ({ count: count + 1 }),
    [DEC]: ({ count }) => ({ count: count - 1 }),
    [INC_BY]: ({ count }, { payload }) => ({ count: count + payload }),
    [WITH_META]: ({ count }, { payload }) => ({ count: count + payload }),
  },
  initialState,
);

export default reducer;
```

### Type utils

`safe-redux` also provides some type utils to work with Redux.

#### `BindAction`

Changes the return type of an action creator to `void`. In the context of a
component the only important part of an action is the types of it's arguments.
We don't rely on the return type.

```typescript
// src/pages/MyPage/actions.ts

import { ActionsUnion, createAction } from '@housinganywhere/safe-redux';

export const INC = '[counter] increment';
export const DEC = '[counter] decrement';
export const INC_BY = '[counter] increment_BY';

export const Actions = {
  incBy: (by: number) => createAction(INC_BY, { by }),
};

export type Actions = ActionsUnion<typeof Actions>;

// src/pages/MyPage/MyPage.container.ts

import { connect } from 'react-redux';
import { BindAction } from '@housinganywhere/safe-redux';

import { Actions } from './actions';
import MyPage from './MyPage';

interface StateProps {
  count: number;
}

interface DispatchProps {
  incBy: BindAction<typeof Actions.incBy>; // (arg: number) => void
}

type MyPageProps = StateProps & DispatchProps;

export default connect<StateProps, DispatchProps>(
  (s) => ({ count: s.count }),
  { incBy: Actions.incBy },
)(MyPage);
```

## Differences with `rex-tils`

- Actions created by `createAction` are compliant with
  [`flux-standard-actions`](https://github.com/redux-utilities/flux-standard-action),
  meaning they have an `error` property set to `true` when the payload is
  `instanceof Error` and might have a `meta` property.
- Added `handleActions` to create type safe reducers.
- Smaller API. `safe-redux` only exports a few functions and types:
  - Functions: `createAction` and `handleActions`.
  - Types: `Action`, `ActionsUnion`, `ActionsOfType` and `BindAction`.
