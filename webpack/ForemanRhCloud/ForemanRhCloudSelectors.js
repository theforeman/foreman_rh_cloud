// export const selectForemanRhCloud = state => state.ForemanRhCloud || {};
// Added 'state' to use redux in storybook only, should be removed.
export const selectForemanRhCloud = state =>
  state.ForemanRhCloud || state || {};
