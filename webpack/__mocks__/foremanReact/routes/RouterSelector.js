export const selectRouter = state => state.router;
export const selectRouterLocation = state => selectRouter(state).location;
