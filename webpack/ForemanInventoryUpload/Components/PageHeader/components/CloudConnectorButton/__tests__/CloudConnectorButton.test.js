import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CloudConnectorButton } from '../CloudConnectorButton';
import { CONNECTOR_STATUS } from '../CloudConnectorConstants';

describe('CloudConnectorButton', () => {
  it('renders "Configure cloud connector" when not resolved', () => {
    render(
      <CloudConnectorButton
        status={CONNECTOR_STATUS.NOT_RESOLVED}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Configure cloud connector/ })).toBeTruthy();
  });

  it('renders "Reconfigure cloud connector" when resolved', () => {
    render(
      <CloudConnectorButton
        status={CONNECTOR_STATUS.RESOLVED}
        onClick={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Reconfigure cloud connector/ })).toBeTruthy();
  });

  it('renders in-progress button when pending', () => {
    render(
      <CloudConnectorButton
        status={CONNECTOR_STATUS.PENDING}
        onClick={jest.fn()}
        jobLink="/job-link"
      />
    );
    expect(
      screen.getByText('Cloud Connector is in progress')
    ).toBeTruthy();
  });

  it('calls onClick when configure button is clicked', () => {
    const onClick = jest.fn();
    render(
      <CloudConnectorButton
        status={CONNECTOR_STATUS.NOT_RESOLVED}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Configure cloud connector/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
