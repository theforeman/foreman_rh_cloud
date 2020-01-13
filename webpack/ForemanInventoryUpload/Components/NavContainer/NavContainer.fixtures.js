import React from 'react';
import { noop } from 'patternfly-react';

export const props = {
  items: [
    {
      icon: 'some-icon',
      name: 'some-name',
      component: () => <p>test</p>,
      onClick: noop,
    },
  ],
};
