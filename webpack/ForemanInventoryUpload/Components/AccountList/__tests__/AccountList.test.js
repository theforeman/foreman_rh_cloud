import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountList from '../AccountList';
import { accounts } from '../AccountList.fixtures';

jest.mock('../Components/ListItem', () => ({ label }) => (
  <div data-testid="list-item">{label}</div>
));

describe('AccountList', () => {
  it('renders list items for each account', () => {
    render(<AccountList accounts={accounts} />);
    expect(screen.getAllByTestId('list-item')).toHaveLength(
      Object.keys(accounts).length
    );
  });

  it('renders account labels', () => {
    render(<AccountList accounts={accounts} />);
    Object.keys(accounts).forEach(label => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });

  it('shows empty results when filterTerm matches nothing', () => {
    render(<AccountList accounts={accounts} filterTerm="not_matching_term" />);
    expect(
      screen.getByText(
        "Oops! Couldn't find organization that matches your query"
      )
    ).toBeTruthy();
  });

  it('shows empty state when accounts are empty', () => {
    render(<AccountList accounts={{}} />);
    expect(
      screen.getByText('Fetching data about your accounts')
    ).toBeTruthy();
  });

  it('shows error state when error is present', () => {
    render(<AccountList accounts={{}} error="Server error" />);
    expect(screen.getByText('Server error')).toBeTruthy();
  });
});
