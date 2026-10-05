import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { useIopIframeHeight } from '../useIopIframeHeight';
import { IOP_IFRAME_HEIGHT } from '../iopIframeConstants';

const HostTabIframe = () => {
  const iframeRef = useRef(null);
  useIopIframeHeight({ iframeRef });

  return (
    <iframe
      ref={iframeRef}
      data-testid="height-iframe"
      title="height-iframe"
      src="about:blank"
    />
  );
};

describe('useIopIframeHeight', () => {
  it('sizes the iframe from a HEIGHT message', () => {
    const { getByTestId } = render(<HostTabIframe />);
    const iframe = getByTestId('height-iframe');

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          type: IOP_IFRAME_HEIGHT,
          payload: { height: 2100 },
        },
      })
    );

    expect(iframe.style.height).toBe('2100px');
  });
});
