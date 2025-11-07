import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import InsightsTab from '../InsightsTab';
import { props } from './InsightsTab.fixtures';

describe('InsightsTab', () => {
  describe('rendering', () => {
    it('should render with props', () => {
      render(<InsightsTab {...props} />);
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });

    it('should render empty state when hits array is empty', () => {
      render(<InsightsTab hostID={1} hits={[]} />);
      expect(screen.getByText('No recommendations were found for this host!')).toBeInTheDocument();
    });

    it('should use default props when hits is not provided', () => {
      render(<InsightsTab hostID={1} />);
      expect(screen.getByText('No recommendations were found for this host!')).toBeInTheDocument();
    });
  });
});
