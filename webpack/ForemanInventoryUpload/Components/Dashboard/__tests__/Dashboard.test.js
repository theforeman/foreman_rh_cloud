import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import Dashboard from '../Dashboard';

const { renderWithStoreAndI18n } = rtlHelpers;

jest.mock('../../../../common/Hooks/ConfigHooks', () => ({
  useIopConfig: jest.fn(() => false),
}));

const runningTask = {
  id: 'task-1',
  state: 'running',
  result: null,
  progress: 50,
};

const inventoryStore = {
  API: {
    INVENTORY_SETTINGS: {
      response: { subscriptionConnectionEnabled: true },
    },
  },
};

const renderDashboard = (props = {}) =>
  renderWithStoreAndI18n(<Dashboard {...props} />, inventoryStore);

describe('Dashboard', () => {
  it('renders report generation progress for a running task', async () => {
    const onTaskStart = jest.fn();

    renderDashboard({
      account: { id: 1, generate_task: runningTask },
      onTaskStart,
    });

    expect(await screen.findByText('Report Generation')).toBeInTheDocument();
    expect(screen.getByLabelText('task-progress')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View task details' })
    ).toHaveAttribute('href', '/foreman_tasks/tasks/task-1');
    expect(
      screen.getByRole('button', { name: 'Generate and upload report' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Generate report' })
    ).toBeDisabled();
  });

  it('shows an empty state when account data is missing', async () => {
    renderDashboard({ account: null, onTaskStart: null });

    expect(await screen.findByText('No recent tasks')).toBeInTheDocument();
    expect(screen.getByText('No account data available.')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Generate report' })
    ).not.toBeInTheDocument();
  });

  it('shows generate actions when the account has no generate task', async () => {
    renderDashboard({
      account: { id: 1, generate_task: null },
      onTaskStart: null,
    });

    expect(
      await screen.findByText('No report generation tasks have been run yet.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate and upload report' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate report' })
    ).toBeInTheDocument();
  });

  it('renders the task without generate actions when account id is missing', async () => {
    renderDashboard({
      account: { generate_task: runningTask },
      onTaskStart: null,
    });

    expect(
      await screen.findByRole('link', { name: 'View task details' })
    ).toHaveAttribute('href', '/foreman_tasks/tasks/task-1');
    expect(
      screen.queryByRole('button', { name: 'Generate report' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Generate and upload report' })
    ).not.toBeInTheDocument();
  });
});
