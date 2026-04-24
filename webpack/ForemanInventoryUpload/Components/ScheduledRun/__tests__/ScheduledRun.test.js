import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ScheduledRun from '../ScheduledRun';

const renderWithIntl = ui =>
  render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('ScheduledRun', () => {
  it('renders next run info when autoUploadEnabled and date are set', () => {
    renderWithIntl(
      <ScheduledRun date="2019-08-21T16:14:16.520+03:00" autoUploadEnabled />
    );
    expect(screen.getByText(/Next run:/)).toBeTruthy();
  });

  it('renders nothing when autoUploadEnabled is false', () => {
    renderWithIntl(
      <ScheduledRun
        date="2019-08-21T16:14:16.520+03:00"
        autoUploadEnabled={false}
      />
    );
    expect(screen.queryByText(/Next run:/)).toBeNull();
  });

  it('renders nothing when date is null', () => {
    renderWithIntl(
      <ScheduledRun date={null} autoUploadEnabled />
    );
    expect(screen.queryByText(/Next run:/)).toBeNull();
  });
});
