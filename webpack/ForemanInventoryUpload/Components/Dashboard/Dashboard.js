import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import TaskProgress from '../TaskProgress';
import NavContainer from '../NavContainer';
import './dashboard.scss';

const Dashboard = ({ account }) => (
  <NavContainer
    items={[
      {
        icon: 'database',
        name: __('Report Generation'),
        component: TaskProgress,
        props: {
          task: account.generate_task,
          title: __('Report Generation'),
          emptyMessage: __('No report generation tasks have been run yet.'),
          organizationId: account.id,
          taskType: 'generate',
        },
      },
      {
        icon: 'cloud-upload',
        name: __('Upload'),
        component: TaskProgress,
        props: {
          task: account.upload_task,
          title: __('Upload'),
          emptyMessage: __('No upload tasks have been run yet.'),
          organizationId: account.id,
          taskType: 'upload',
        },
      },
    ]}
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
    }),
    upload_task: PropTypes.shape({
      id: PropTypes.string,
      state: PropTypes.string,
      result: PropTypes.string,
      progress: PropTypes.number,
      started_at: PropTypes.string,
      ended_at: PropTypes.string,
      duration: PropTypes.number,
    }),
  }),
};

Dashboard.defaultProps = {
  account: {
    generate_task: null,
    upload_task: null,
  },
};

export default Dashboard;
