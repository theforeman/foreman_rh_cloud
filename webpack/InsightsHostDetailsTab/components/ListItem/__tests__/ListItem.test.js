import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Accordion } from '@patternfly/react-core';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import ListItem from '../ListItem';

const { renderWithI18n } = rtlHelpers;

const defaultProps = {
  title: 'Test recommendation title',
  totalRisk: 2,
  resultsUrl:
    'https://cloud.redhat.com/insights/advisor/recommendations/example',
  solutionUrl: 'https://access.redhat.com/solutions/123456',
};

const renderListItem = (props = {}) =>
  renderWithI18n(
    <Accordion>
      <ListItem {...defaultProps} {...props} />
    </Accordion>
  );

describe('ListItem', () => {
  it('renders the recommendation title when collapsed', async () => {
    renderListItem();

    expect(
      await screen.findByText('Test recommendation title')
    ).toBeInTheDocument();
  });

  it('renders the total risk label when collapsed', async () => {
    renderListItem({ totalRisk: 2 });

    expect(await screen.findByText('Moderate')).toBeInTheDocument();
  });

  it('does not show detail links before expanding', async () => {
    renderListItem();

    await screen.findByText('Test recommendation title');

    expect(
      screen.queryByRole('link', { name: /Knowledgebase article/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: /Read more about it in RH cloud insights/i,
      })
    ).not.toBeInTheDocument();
  });

  it('shows detail links after expanding the recommendation', async () => {
    renderListItem();

    await userEvent.click(await screen.findByRole('button'));

    const knowledgebaseLink = screen.getByRole('link', {
      name: /Knowledgebase article/i,
    });
    expect(knowledgebaseLink).toHaveAttribute('href', defaultProps.solutionUrl);
    expect(knowledgebaseLink).toHaveAttribute('target', '_blank');
    expect(knowledgebaseLink).toHaveAttribute('rel', 'noopener noreferrer');

    const insightsCloudLink = screen.getByRole('link', {
      name: /Read more about it in RH cloud insights/i,
    });
    expect(insightsCloudLink).toHaveAttribute('href', defaultProps.resultsUrl);
    expect(insightsCloudLink).toHaveAttribute('target', '_blank');
    expect(insightsCloudLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the knowledgebase link when no solution URL is provided', async () => {
    renderListItem({ solutionUrl: '' });

    await userEvent.click(await screen.findByRole('button'));

    expect(
      screen.queryByRole('link', { name: /Knowledgebase article/i })
    ).not.toBeInTheDocument();

    const insightsCloudLink = screen.getByRole('link', {
      name: /Read more about it in RH cloud insights/i,
    });
    expect(insightsCloudLink).toBeInTheDocument();
    expect(insightsCloudLink).toHaveAttribute('target', '_blank');
    expect(insightsCloudLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the insights cloud link when no results URL is provided', async () => {
    renderListItem({ resultsUrl: '' });

    await userEvent.click(await screen.findByRole('button'));

    const knowledgebaseLink = screen.getByRole('link', {
      name: /Knowledgebase article/i,
    });
    expect(knowledgebaseLink).toBeInTheDocument();
    expect(knowledgebaseLink).toHaveAttribute('target', '_blank');
    expect(knowledgebaseLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(
      screen.queryByRole('link', {
        name: /Read more about it in RH cloud insights/i,
      })
    ).not.toBeInTheDocument();
  });
});
