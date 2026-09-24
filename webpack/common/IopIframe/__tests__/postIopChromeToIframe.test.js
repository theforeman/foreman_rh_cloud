import { postIopChromeToIframe } from '../postIopChromeToIframe';
import { IOP_CHROME_INIT } from '../iopIframeConstants';

describe('postIopChromeToIframe', () => {
  it('posts appRoute and embedded mode', () => {
    const postMessage = jest.fn();
    const iframe = { contentWindow: { postMessage } };

    postIopChromeToIframe(iframe, {
      permissions: [{ permission: 'compliance:policies:read' }],
      pathname: '/new/hosts/demo.example.com',
      appRoute: 'systems/uuid-1',
      embedded: 'host-tab',
    });

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: IOP_CHROME_INIT,
        payload: {
          user: expect.any(Object),
          permissions: [{ permission: 'compliance:policies:read' }],
          appRoute: 'systems/uuid-1',
          pathname: '/new/hosts/demo.example.com',
          embedded: 'host-tab',
        },
      },
      window.location.origin
    );
  });

  it('omits embedded from payload when not provided', () => {
    const postMessage = jest.fn();
    const iframe = { contentWindow: { postMessage } };

    postIopChromeToIframe(iframe, {
      permissions: [],
      pathname: '/foreman_rh_cloud/insights_compliance/scappolicies',
      appRoute: 'scappolicies',
    });

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: IOP_CHROME_INIT,
        payload: {
          user: expect.any(Object),
          permissions: [],
          appRoute: 'scappolicies',
          pathname: '/foreman_rh_cloud/insights_compliance/scappolicies',
        },
      },
      window.location.origin
    );
  });

  it('no-ops when iframe has no contentWindow', () => {
    expect(() =>
      postIopChromeToIframe(null, { appRoute: 'reports' })
    ).not.toThrow();
  });
});
