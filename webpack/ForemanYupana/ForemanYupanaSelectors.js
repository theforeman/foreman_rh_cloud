// export const selectForemanYupana = state => state.ForemanYupana || {};
// Added 'state' to use redux in storybook only, should be removed.
export const selectForemanYupana = state => state.ForemanYupana || state || {};
