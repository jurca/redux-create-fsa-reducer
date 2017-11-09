'use strict';

module.exports = (initialState, reducerMethods) => {
  if (process.env.NODE_ENV !== 'production') {
    if (reducerMethods.undefined) {
      console.warn( // eslint-disable-line no-console
        'The provided reducer contains a handler for the "undefined" action type. Have you misspelled a constant?',
        reducerMethods,
      );
    }
  }

  return (state, action) => {
    const currentState = state === undefined ? initialState : state;

    if (reducerMethods.hasOwnProperty(action.type)) {
      return reducerMethods[action.type](
        currentState,
        action.error ? undefined : action.payload,
        action.error ? action.payload : undefined,
        action.meta,
      );
    } else {
      return currentState;
    }
  };
};
