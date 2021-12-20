import { translate as __ } from 'foremanReact/common/I18n';

export const INSIGHTS_HITS_REQUEST = 'INSIGHTS_HITS_REQUEST';
export const INSIGHTS_HITS_SUCCESS = 'INSIGHTS_HITS_SUCCESS';

export const getInitialRisks = () => ({
  1: {
    value: 0,
    title: __('Low'),
    hoverFill: '#2b9af3',
  },
  2: {
    value: 0,
    title: __('Moderate'),
    hoverFill: '#d5a632',
  },
  3: {
    value: 0,
    title: __('Important'),
    hoverFill: '#ec7a08',
  },
  4: {
    value: 0,
    title: __('Critical'),
    hoverFill: '#7d1007',
  },
  total: 0,
});

const colorScale = ['#bee1f4', '#f4c145', '#f4b678', '#c9190b'];

export const theme = {
  legend: {
    gutter: 20,
    orientation: 'horizontal',
    titleOrientation: 'top',
    style: {
      data: {
        type: 'square',
      },
      labels: {
        fontFamily: 'RedHatText',
        fontSize: 14,
        letterSpacing: 'normal',
        padding: 10,
        stroke: 'transparent',
        fill: '#06c',
        textDecorationColor: '#06c',
      },
      title: {
        fontFamily: 'RedHatText',
        fontSize: 14,
        letterSpacing: 'normal',
        padding: 2,
        stroke: 'transparent',
      },
    },
    colorScale,
  },
  pie: {
    colorScale,
    height: 230,
    padAngle: 1,
    padding: 20,
    style: {
      data: { padding: 8, stroke: 'transparent', strokeWidth: 1 },
      labels: {
        fontFamily: 'RedHatText',
        fontSize: 14,
        letterSpacing: 'normal',
        padding: 8,
        stroke: 'transparent',
      },
    },
    width: 230,
  },
};
