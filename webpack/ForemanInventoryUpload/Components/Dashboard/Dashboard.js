import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import TaskProgress from '../TaskProgress';
import './dashboard.scss';

const Dashboard = ({ account, onTaskStart }) => {
  // Defensive handling for missing or malformed account data
  if (!account) {
    return (
      <TaskProgress
        task={null}
        title={__('Report Generation')}
        emptyMessage={__('No account data available.')}
        organizationId={null}
        taskType="generate"
        onTaskStart={onTaskStart}
      />
    );
  }

  return (
    <TaskProgress
      task={account.generate_task || null}
      title={__('Report Generation')}
      emptyMessage={__('No report generation tasks have been run yet.')}
      organizationId={account.id || null}
      taskType="generate"
      onTaskStart={onTaskStart}
    />
  );
};

Dashboard.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number,
    generate_task: PropTypes.shape({
      id: PropTypes.string,
      state: PropTypes.string,
      result: PropTypes.string,
      progress: PropTypes.number,
      started_at: PropTypes.string,
      ended_at: PropTypes.string,
      duration: PropTypes.number,
      report_file_path: PropTypes.string,
    }),
  }),
  onTaskStart: PropTypes.func,
};

Dashboard.defaultProps = {
  account: null,
  onTaskStart: null,
};

export default Dashboard;
