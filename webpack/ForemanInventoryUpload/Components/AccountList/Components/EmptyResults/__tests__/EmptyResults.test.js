import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyResults from '../EmptyResults';

describe('EmptyResults', () => {
  it('renders the empty results message', () => {
    render(<EmptyResults />);
    expect(
      screen.getByText(
        "Oops! Couldn't find organization that matches your query"
      )
    ).toBeTruthy();
  });
});
