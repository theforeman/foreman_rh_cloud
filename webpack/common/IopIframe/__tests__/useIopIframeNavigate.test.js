import React from 'react';
import { render, act } from '@testing-library/react';
import { useIopIframeNavigate } from '../useIopIframeNavigate';

it('pushes page changes, replaces filter changes, and ignores duplicate routes', () => {
  const prefix = '/foreman_rh_cloud/insights_vulnerability';
  window.history.replaceState(null, '', `${prefix}/cves`);
  const history = { push: jest.fn(), replace: jest.fn() };
  const Listener = () => {
    useIopIframeNavigate({
      history,
      navigateMessageType: 'IOP_VULNERABILITY_NAVIGATE',
      getForemanPath: (route) => `${prefix}/${route}`,
      defaultAppRoute: 'cves',
      replaceSearch: true,
    });
    return null;
  };
  render(<Listener />);
  const navigate = (appRoute) =>
    act(() =>
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: window.location.origin,
          data: { type: 'IOP_VULNERABILITY_NAVIGATE', payload: { appRoute } },
        })
      )
    );
  navigate('cves');
  expect(history.push).not.toHaveBeenCalled();
  navigate('cves?filter=test');
  expect(history.replace).toHaveBeenCalledWith(`${prefix}/cves?filter=test`);
  navigate('cves/CVE-2026-1234');
  expect(history.push).toHaveBeenCalledWith(`${prefix}/cves/CVE-2026-1234`);
  window.history.replaceState(null, '', '/');
});
