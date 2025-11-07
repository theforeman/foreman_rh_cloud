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

    it('should render without hits', () => {
      render(<InsightsTab hits={[]} />);
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });

    it('should handle undefined hits gracefully', () => {
      render(<InsightsTab hits={undefined} />);
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });

    it('should handle null hits gracefully', () => {
      render(<InsightsTab hits={null} />);
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });
  });
});
