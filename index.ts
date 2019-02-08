interface IFluxStandardAction<P = void, M = void> {
    type: string
    payload?: P
    meta?: M
}

interface IFluxStandardErrorAction<E extends Error = Error, M = void> extends IFluxStandardAction<E, M> {
    payload: E,
    error: true
}

type FluxStandardAction<P = any, E extends Error = Error, M = any> =
    IFluxStandardAction<P, M> |
    IFluxStandardErrorAction<E, M>

type BasicActionReducer<S extends object, P, M> = (state: S, payload: P, error: void, meta: M) => S
type ErrorActionReducer<S extends object, E extends Error, M> = (state: S, payload: void, error: E, meta: M) => S
type ActionReducer<S extends object, P, E extends Error, M> =
    BasicActionReducer<S, P, M> |
    ErrorActionReducer<S, E, M>

export default <
    S extends object,
    R extends {[actionType: string]: undefined | ActionReducer<S, any, Error, any>},
>(
    initialState: S,
    reducerMethods: R,
): (state: void | S, action: FluxStandardAction) => S => {
    if (process.env.NODE_ENV !== "production") {
        if ("undefined" in reducerMethods) {
            console.warn( // tslint:disable-line no-console
                "The provided reducer contains a handler for the \"undefined\" action type. Have you misspelled a " +
                "constant?",
                reducerMethods,
            )
        }
    }

    return (state: void | S, action: FluxStandardAction): S => {
        const currentState = state === undefined ? initialState : state
        if (action.type in reducerMethods) {
            const actionReducer = reducerMethods[action.type]
            if ("error" in action && action.error) {
                return (actionReducer as ErrorActionReducer<S, Error, any>)(
                    currentState,
                    undefined,
                    action.payload,
                    action.meta,
                )
            } else {
                return (actionReducer as BasicActionReducer<S, any, any>)(
                    currentState,
                    action.payload,
                    undefined,
                    action.meta,
                )
            }
        }

        return currentState
    }
}
