import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileDownload from '../FileDownload';

describe('FileDownload', () => {
  it('renders the download button', () => {
    render(<FileDownload />);
    expect(screen.getByText('Download Report')).toBeTruthy();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = jest.fn();
    render(<FileDownload onClick={onClick} />);
    fireEvent.click(screen.getByText('Download Report'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
