import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import TaskProgress from '../TaskProgress';
import './dashboard.scss';

const Dashboard = ({ account }) => (
  <TaskProgress
    task={account.generate_task}
    title={__('Report Generation')}
    emptyMessage={__('No report generation tasks have been run yet.')}
    organizationId={account.id}
    taskType="generate"
  />
);

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
};

Dashboard.defaultProps = {
  account: {
    generate_task: null,
  },
};

export default Dashboard;
