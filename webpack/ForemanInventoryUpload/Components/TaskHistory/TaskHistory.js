import React from 'react';
import PropTypes from 'prop-types';
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import './taskHistory.scss';

const TaskHistory = ({ tasks, title }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CheckCircleIcon} />
        <Title headingLevel="h4" size="lg">
          {__('No task history')}
        </Title>
        <EmptyStateBody>
          {__('Previous tasks will appear here.')}
        </EmptyStateBody>
      </EmptyState>
    );
  }

  const getResultIcon = (result) => {
    if (result === 'success') {
      return <CheckCircleIcon className="task-history-icon-success" />;
    }
    if (result === 'error') {
      return <ExclamationCircleIcon className="task-history-icon-error" />;
    }
    if (result === 'warning') {
      return <ExclamationTriangleIcon className="task-history-icon-warning" />;
    }
    return null;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return __('N/A');
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getResultLabel = (result) => {
    if (result === 'success') return __('Success');
    if (result === 'error') return __('Failed');
    if (result === 'warning') return __('Warning');
    return result || __('Unknown');
  };

  return (
    <div className="task-history-container">
      {title && <Title headingLevel="h3" size="md">{title}</Title>}
      <DataList aria-label="task history" className="task-history-list">
        {tasks.map(task => (
          <DataListItem key={task.id} aria-labelledby={`task-${task.id}`}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="icon" className="task-history-icon-cell">
                    {getResultIcon(task.result)}
                  </DataListCell>,
                  <DataListCell key="time" className="task-history-time-cell">
                    <RelativeDateTime date={task.started_at} />
                  </DataListCell>,
                  <DataListCell key="result" className="task-history-result-cell">
                    {getResultLabel(task.result)}
                  </DataListCell>,
                  <DataListCell key="duration" className="task-history-duration-cell">
                    {formatDuration(task.duration)}
                  </DataListCell>,
                  <DataListCell key="link" className="task-history-link-cell">
                    <a href={`/foreman_tasks/tasks/${task.id}`}>
                      {__('Details')}
                    </a>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    </div>
  );
};

TaskHistory.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      result: PropTypes.string,
      started_at: PropTypes.string,
      duration: PropTypes.number,
    })
  ),
  title: PropTypes.string,
};

TaskHistory.defaultProps = {
  tasks: [],
  title: null,
};

export default TaskHistory;
