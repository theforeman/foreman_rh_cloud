import React from 'react';
import { shallow } from '@theforeman/test';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('should render TaskProgress component with correct props', () => {
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

    const taskProgress = wrapper.find('TaskProgress');
    expect(taskProgress).toHaveLength(1);
    expect(taskProgress.prop('task')).toEqual(account.generate_task);
    expect(taskProgress.prop('title')).toBe('Report Generation');
    expect(taskProgress.prop('organizationId')).toBe(1);
    expect(taskProgress.prop('taskType')).toBe('generate');
    expect(taskProgress.prop('onTaskStart')).toBe(onTaskStart);
  });

  it('should handle missing account gracefully', () => {
    const wrapper = shallow(<Dashboard account={null} onTaskStart={null} />);

    const taskProgress = wrapper.find('TaskProgress');
    expect(taskProgress).toHaveLength(1);
    expect(taskProgress.prop('task')).toBeNull();
    expect(taskProgress.prop('organizationId')).toBeNull();
    expect(taskProgress.prop('emptyMessage')).toBe(
      'No account data available.'
    );
  });

  it('should handle missing generate_task gracefully', () => {
    const account = { id: 1, generate_task: null };
    const wrapper = shallow(<Dashboard account={account} onTaskStart={null} />);

    const taskProgress = wrapper.find('TaskProgress');
    expect(taskProgress).toHaveLength(1);
    expect(taskProgress.prop('task')).toBeNull();
    expect(taskProgress.prop('organizationId')).toBe(1);
  });

  it('should handle missing account.id gracefully', () => {
    const account = {
      generate_task: {
        id: 'task-1',
        state: 'running',
      },
    };
    const wrapper = shallow(<Dashboard account={account} onTaskStart={null} />);

    const taskProgress = wrapper.find('TaskProgress');
    expect(taskProgress).toHaveLength(1);
    expect(taskProgress.prop('organizationId')).toBeNull();
    expect(taskProgress.prop('task')).toEqual(account.generate_task);
  });
});
