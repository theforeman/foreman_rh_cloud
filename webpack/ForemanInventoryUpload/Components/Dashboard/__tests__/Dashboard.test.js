import React from 'react';
import { shallow } from '@theforeman/test';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('should render TaskProgress component', () => {
    const account = {
      id: 1,
      generate_task: {
        id: 'task-1',
        state: 'running',
        result: null,
        progress: 50,
      },
    };
    const onTaskStart = jest.fn();

    const wrapper = shallow(
      <Dashboard account={account} onTaskStart={onTaskStart} />
    );

    expect(wrapper.find('TaskProgress')).toHaveLength(1);
  });
});
