import React from 'react';
import { shallow, testComponentSnapshotsWithFixtures } from '@theforeman/test';
import Dashboard from '../Dashboard';
import { props } from '../Dashboard.fixtures';

const fixtures = {
  'with props': props,
};

describe('Dashboard', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Dashboard, fixtures));

  it('componentWillUnmount should call "stopPolling"', () => {
    const stopPolling = jest.fn();
    const modifiedProps = {
      ...props,
      stopPolling,
    };
    const wrapper = shallow(<Dashboard {...modifiedProps} />);
    wrapper.unmount();
    expect(stopPolling).toBeCalled();
  });
});
