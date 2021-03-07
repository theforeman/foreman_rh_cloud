import React from 'react';
import { noop } from 'foremanReact/common/helpers';

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
