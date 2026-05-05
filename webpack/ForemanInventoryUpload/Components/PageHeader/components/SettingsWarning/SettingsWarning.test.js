import React from 'react';
import { render, screen } from '@testing-library/react';
import { SettingsWarning } from './SettingsWarning';

describe('SettingsWarning', () => {
  it('renders nothing when isCloudConnector is false', () => {
    render(
      <SettingsWarning autoUpload={false} isCloudConnector={false} />
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders nothing when autoUpload is on and obfuscation is off', () => {
    render(
      <SettingsWarning
        autoUpload
        hostObfuscation={false}
        isCloudConnector
      />
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders upload warning when autoUpload is disabled', () => {
    render(
      <SettingsWarning
        autoUpload={false}
        hostObfuscation={false}
        isCloudConnector
      />
    );
    expect(
      screen.getByText(/inventory auto-upload is disabled/)
    ).toBeTruthy();
  });

  it('renders obfuscation warning when hostObfuscation is enabled', () => {
    render(
      <SettingsWarning autoUpload hostObfuscation isCloudConnector />
    );
    expect(
      screen.getByText(/obfuscating host names setting is enabled/)
    ).toBeTruthy();
  });

  it('renders both warnings when both conditions met', () => {
    render(
      <SettingsWarning
        autoUpload={false}
        hostObfuscation
        isCloudConnector
      />
    );
    expect(
      screen.getByText(/inventory auto-upload is disabled/)
    ).toBeTruthy();
    expect(
      screen.getByText(/obfuscating host names setting is enabled/)
    ).toBeTruthy();
  });
});
