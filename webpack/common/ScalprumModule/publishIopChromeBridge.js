export const publishIopChromeBridge = providerOptions => {
  if (typeof window === 'undefined' || !providerOptions?.api?.chrome) {
    return;
  }

  window.insights = window.insights || {};
  window.insights.chrome = providerOptions.api.chrome;
};
