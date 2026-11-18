import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as APIHooks from 'foremanReact/common/hooks/API/APIHooks';
import * as ConfigHooks from '../../common/Hooks/ConfigHooks';
import { CompliancePoliciesCell } from '../CompliancePoliciesCell';

jest.mock('foremanReact/common/hooks/API/APIHooks');
jest.mock('../../common/Hooks/ConfigHooks');

const hostDetails = {
  id: 1,
  name: 'test-host.example.com',
  subscription_facet_attributes: {
    uuid: 'test-uuid-123',
  },
};

const renderCell = (props = {}) =>
  render(<CompliancePoliciesCell hostDetails={hostDetails} {...props} />);

describe('CompliancePoliciesCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ConfigHooks.useIopConfig.mockReturnValue(true);
    APIHooks.useAPI.mockReturnValue({ response: null });
  });

  it('renders — when the host has no inventory UUID', () => {
    renderCell({
      hostDetails: {
        name: 'test-host.example.com',
        subscription_facet_attributes: { uuid: null },
      },
    });

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(APIHooks.useAPI).toHaveBeenCalledWith(
      null,
      null,
      expect.objectContaining({ key: 'HOST_COMPLIANCE_POLICIES_null' })
    );
  });

  it('renders — when IoP is not enabled', () => {
    ConfigHooks.useIopConfig.mockReturnValue(false);

    renderCell();

    expect(screen.getByText('—')).toBeInTheDocument();
    expect(APIHooks.useAPI).toHaveBeenCalledWith(
      null,
      expect.stringContaining('api/compliance/v2/systems/test-uuid-123'),
      expect.any(Object)
    );
  });

  it('renders — when the system has no policies', () => {
    APIHooks.useAPI.mockReturnValue({
      response: { data: { policies: [] } },
    });

    renderCell();

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders assigned policy titles', () => {
    APIHooks.useAPI.mockReturnValue({
      response: {
        data: {
          policies: [
            { id: '1', title: 'ANSSI-BP-028 (high)' },
            {
              id: '2',
              title: 'CIS Red Hat Enterprise Linux 7 Benchmark for Level 1 - Server',
            },
          ],
        },
      },
    });

    renderCell();

    expect(
      screen.getByText(
        'ANSSI-BP-028 (high), CIS Red Hat Enterprise Linux 7 Benchmark for Level 1 - Server'
      )
    ).toBeInTheDocument();
    expect(APIHooks.useAPI).toHaveBeenCalledWith(
      'get',
      expect.stringContaining(
        '/insights_cloud/api/compliance/v2/systems/test-uuid-123'
      ),
      expect.objectContaining({
        key: 'HOST_COMPLIANCE_POLICIES_test-uuid-123',
      })
    );
  });
});
