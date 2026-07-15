// Arbitrary fallback for this test double only; the real foremanReact
// default lives in IntervalMiddleware/IntervalConstants.js.
const DEFAULT_INTERVAL_MS = 3000;

export const withInterval = (action, interval = DEFAULT_INTERVAL_MS) => ({
  ...action,
  interval,
});
