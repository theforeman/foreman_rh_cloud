import React from 'react';
import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { mount } from 'enzyme';

import Terminal from '../Terminal';
import { props, logs } from '../Terminal.fixtures';

const fixtures = {
  'render without Props': {},
  'render with props': props,
};

describe('Terminal', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Terminal, fixtures));
});

describe('componentDidUpdate', () => {
  it('handles terminal scroll', () => {
    const wrapper = mount(<Terminal {...props} />);
    jest.spyOn(wrapper.instance(), 'handleScroll');
    wrapper.setProps({ logs: [...logs, 'new-log'] });
    expect(wrapper.instance().handleScroll).toBeCalled();
  });
});
