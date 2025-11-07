import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import TaskProgress from '../TaskProgress';
import NavContainer from '../NavContainer';
import './dashboard.scss';

class Dashboard extends React.Component {
  handleTabChange = tabName => {
    const { setActiveTab, accountID } = this.props;
    setActiveTab(accountID, tabName);
  };

  render() {
    const { account, activeTab } = this.props;

    return (
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
            },
            onClick: () => this.handleTabChange('generating'),
          },
          {
            icon: 'cloud-upload',
            name: __('Upload'),
            component: TaskProgress,
            props: {
              task: account.upload_task,
              title: __('Upload'),
              emptyMessage: __('No upload tasks have been run yet.'),
            },
            onClick: () => this.handleTabChange('uploading'),
          },
        ]}
        showFullScreen={false}
        terminalProps={null}
      />
    );
  }
}

Dashboard.propTypes = {
  accountID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setActiveTab: PropTypes.func,
  account: PropTypes.shape({
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
  activeTab: PropTypes.string,
};

Dashboard.defaultProps = {
  setActiveTab: noop,
  account: {
    generate_task: null,
    upload_task: null,
  },
  activeTab: 'generating',
};

export default Dashboard;
