import React from 'react';
import { mount, testComponentSnapshotsWithFixtures } from '@theforeman/test';
import Terminal from '../Terminal';
import { props, logs } from '../Terminal.fixtures';

const fixtures = {
  'render without Props': {},
  'render with props': props,
};

describe('Terminal', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Terminal, fixtures));

  it('handles terminal scroll on componentDidUpdate', () => {
    const wrapper = mount(<Terminal {...props} />);
    jest.spyOn(wrapper.instance(), 'scrollBottom');
    wrapper.setProps({ logs: [...logs, 'new-log'] });
    expect(wrapper.instance().scrollBottom).toBeCalled();
  });

  it('error should be displayed in terminal', () => {
    const modifiedProps = { ...props, error: 'some-error' };
    const wrapper = mount(<Terminal {...modifiedProps} />);
    expect(wrapper.find('p.terminal_error').exists()).toBeTruthy();
  });

  it('logs as a string instead of an array should be displayed', () => {
    const text = 'some-string-log';
    const modifiedProps = { ...props, logs: text };
    const wrapper = mount(<Terminal {...modifiedProps} />);
    expect(wrapper.find('.rh-cloud-inventory-terminal p').text()).toEqual(text);
  });
});
