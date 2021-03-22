export const withInterval = (action, interval = 3000) => ({
  ...action,
  interval,
});
