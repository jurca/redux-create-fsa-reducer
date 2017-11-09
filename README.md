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

```javascript
import createReducer from 'redux-create-fsa-reducer';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

export const todos = createReducer(initialState, {
  [ActionTypes.ADD_TODO](state, text) {
    return {
      ...state,
      items: [...state.items, text.trim()]
    };
  },
  [ActionTypes.TODO_FETCH_COMPLETE](state, todos, error, meta) {
    if (error) {
      return {
        ...state,
        lastError: error,
        lastErrorDetails: meta
      };
    }
    
    return {
      ...state,
      items: todos,
    }
  }
})
```
