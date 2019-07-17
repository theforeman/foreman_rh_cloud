import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import ReportGenerate from '../ReportGenerate';
import ReportUpload from '../ReportUpload';
import NavContainer from '../NavContainer';
import './Dashboard.scss';

const Dashboard = ({ generating, uploading }) => (
  <NavContainer
    items={[
      {
        icon: 'database',
        name: 'Generating',
        component: () => <ReportGenerate {...generating} />,
      },
      {
        icon: 'cloud-upload',
        name: 'Uploading',
        component: () => <ReportUpload {...uploading} />,
      },
    ]}
  />
);

Dashboard.propTypes = {
  generating: PropTypes.shape({
    exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    logs: PropTypes.arrayOf(PropTypes.string),
    onRestart: PropTypes.func,
    processScheduledTime: PropTypes.string,
  }),
  uploading: PropTypes.shape({
    exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    files: PropTypes.arrayOf(PropTypes.string),
    logs: PropTypes.arrayOf(PropTypes.string),
    onRestart: PropTypes.func,
    onDownload: PropTypes.func,
  }),
};

Dashboard.defaultProps = {
  generating: {
    exitCode: 0,
    logs: ['No running process'],
    processScheduledTime: '00:00',
    onRestart: noop,
  },
  uploading: {
    exitCode: 0,
    files: ['213783213', '213213213', '101763276', '12387892712'],
    logs: ['No running process'],
    onRestart: noop,
    onDownload: noop,
  },
};

export default Dashboard;
