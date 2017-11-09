'use strict';

const createReducer = require('./index.js');

describe('redux-create-fsa-reducer', () => {
  it('should output a warning in non-production environment if an "undefined" action type handler is present', () => {
    const consoleMock = jest.spyOn(console, 'warn');

    createReducer({}, {
      undefined: () => {},
    });

    expect(consoleMock).toHaveBeenCalled();
  });

  it('should invoke the method matching the action\'s type', () => {
    let fooCalled = false;
    let barCalled = false;
    let bazCalled = false;
    const reducer = createReducer({}, {
      foo() {
        fooCalled = true;
      },
      bar() {
        barCalled = true;
      },
      baz() {
        bazCalled = true;
      },
    });
    reducer({}, {type: 'bar'});
    expect(fooCalled).toBeFalsy();
    expect(barCalled).toBeTruthy();
    expect(bazCalled).toBeFalsy();
  });

  it('should pass the initial state to the callback only if the state is undefined', () => {
    const reducer = createReducer({initial: true}, {
      foo(state) {
        expect(state).toEqual({initial: true});
      },
      bar(state) {
        expect(state).toEqual({other: true});
      },
    });

    reducer(undefined, {type: 'foo'});
    reducer({other: true}, {type: 'bar'});
  });

  it('should pass the action\'s payload directly to the callback', () => {
    const reducer = createReducer({}, {
      foo(state, payload) {
        expect(payload).toBe(123);
      },
    });
    reducer({}, {type: 'foo', payload: 123});
  });

  it('should pass the error and meta info directly to the callback', () => {
    const reducer = createReducer({}, {
      foo(state, payload, error, meta) {
        expect(payload).toBeUndefined();
        expect(error).toBeInstanceOf(Error);
        expect(meta).toEqual({bar: 'baz'});
      },
    });
    reducer({}, {type: 'foo', payload: new Error(), error: true, meta: {bar: 'baz'}});
  });

  it('should pass undefined as result when an action represents an error', () => {
    const reducer = createReducer({}, {
      foo(state, payload) {
        expect(payload).toBeUndefined();
      },
    });
    reducer({}, {type: 'foo', payload: new Error(), error: true});
  });

  it('should pass undefined as the error when the action does not represent one', () => {
    const reducer = createReducer({}, {
      foo(state, payload, error) {
        expect(error).toBeUndefined();
      },
    });
    reducer({}, {type: 'foo', payload: null});
  });

  it('should return the new state', () => {
    const reducer = createReducer({}, {
      foo() {
        return {state: 2};
      },
    });
    const state = reducer({}, {type: 'foo'});
    expect(state).toEqual({state: 2});
  });

  it('should return the state unmodified when the reducer does not match the action\'s type', () => {
    const reducer = createReducer({}, {
      foo() {
        return {state: 2};
      },
    });
    const state = {state: 1};
    expect(reducer(state, {type: 'bar'})).toBe(state);
  });
});
