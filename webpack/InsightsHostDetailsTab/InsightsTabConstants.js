import { translate as __ } from 'foremanReact/common/I18n';

export const INSIGHTS_HITS_REQUEST = 'INSIGHTS_HITS_REQUEST';
export const INSIGHTS_HITS_SUCCESS = 'INSIGHTS_HITS_SUCCESS';

export const getInitialRisks = () => ({
  1: {
    value: 0,
    title: __('Low'),
    fill: '#bee1f4',
    hoverFill: '#2b9af3',
  },
  2: {
    value: 0,
    title: __('Moderate'),
    fill: '#f4c145',
    hoverFill: '#d5a632',
  },
  3: {
    value: 0,
    title: __('Important'),
    fill: '#f4b678',
    hoverFill: '#ec7a08',
  },
  4: {
    value: 0,
    title: __('Critical'),
    fill: '#c9190b',
    hoverFill: '#7d1007',
  },
  total: 0,
});
