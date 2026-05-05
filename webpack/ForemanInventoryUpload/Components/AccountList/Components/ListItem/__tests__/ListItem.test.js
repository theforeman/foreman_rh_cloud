import React from 'react';
import { render, screen } from '@testing-library/react';
import { Accordion } from '@patternfly/react-core';
import ListItem from '../ListItem';

jest.mock('../../../../Dashboard', () => () => null);

const renderListItem = props =>
  render(
    <Accordion>
      <ListItem {...props} />
    </Accordion>
  );

describe('ListItem', () => {
  const defaultProps = {
    label: 'test-org',
    account: {
      generated_status: 'unknown',
      uploaded_status: 'unknown',
      id: 1,
    },
  };

  it('renders the account label', () => {
    renderListItem(defaultProps);
    expect(screen.getByText('test-org')).toBeTruthy();
  });

  it('renders Generated and Uploaded status labels', () => {
    renderListItem(defaultProps);
    expect(screen.getByText('Generated')).toBeTruthy();
    expect(screen.getByText('Uploaded')).toBeTruthy();
  });

});
