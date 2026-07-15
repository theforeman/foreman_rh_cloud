const DEFAULT_INTERVAL_MS = 3000;

export const withInterval = (action, interval = DEFAULT_INTERVAL_MS) => ({
  ...action,
  interval,
});
