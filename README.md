# redux-create-fsa-reducer

Redux reducer factory that is designed for use with Flux Standard Actions (FSA).

This package provides the same functionality as the
[redux-create-reducer](https://www.npmjs.com/package/redux-create-reducer)
(originally based on
[this code](https://redux.js.org/docs/recipes/ReducingBoilerplate.html#generating-reducers)),
except that the action handler methods will receive the action's payload
directly, thus reducing a small amount of boilerplate code. This, however,
requires all actions to follow the
[Flux Standard Action](https://github.com/acdlite/flux-standard-action)
pattern.

## Usage

```typescript
import createReducer from 'redux-create-fsa-reducer'

enum Action {
    ADD_TODO = "ADD_TODO",
    FETCH_TODO_LIST_DONE = "FETCH_TODO_LIST_DONE",
}

/*
Alternative way of declaring action types enum:

interface IActionEnum {
    ADD_TODO: "ADD_TODO"
    FETCH_TODO_LIST_DONE: "FETCH_TODO_LIST_DONE"
}
// The ": IActionEnum" is necessary to make the enum constants unique symbols
const Action: IActionEnum = {
    ADD_TODO: "ADD_TODO",
    FETCH_TODO_LIST_DONE: "FETCH_TODO_LIST_DONE",
}
*/

interface IState {
    items: string[]
    lastError: null | Error,
    lastErrorDetails: any
}
const DEFAULT_STATE: IState = {
    items: [],
    lastError: null,
    lastErrorDetails: null,
}

// An interface cannot be used here because interfaces, unlike type literals,
// can be extended.
type Reducer = {
    [Action.ADD_TODO]?(state: IState, payload: string): IState,
    [Action.FETCH_TODO_LIST_DONE]?(state: IState, payload: string[]): IState,
    [Action.FETCH_TODO_LIST_DONE]?(state: IState, payload: void, error: Error): IState,
}

export default createReducer<IState, Reducer>(DEFAULT_STATE, {
  [Action.ADD_TODO](state: IState, text: string): IState {
    return {
      ...state,
      items: [...state.items, text.trim()],
    }
  },
  [Action.FETCH_TODO_LIST_DONE](
      state: IState,
      todoList: void | string[],
      error?: Error,
      meta?: any,
  ): IState {
    if (!todoList) {
      return {
        ...state,
        lastError: error,
        lastErrorDetails: meta
      }
    }
    
    return {
      ...state,
      items: todoList,
    }
  },
})
```
