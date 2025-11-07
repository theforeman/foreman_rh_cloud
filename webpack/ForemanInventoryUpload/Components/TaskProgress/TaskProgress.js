import React from 'react';
import PropTypes from 'prop-types';
import {
  Progress,
  ProgressVariant,
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import { ClockIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import './taskProgress.scss';

const TaskProgress = ({ task, title, emptyMessage }) => {
  if (!task) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={ClockIcon} />
        <Title headingLevel="h4" size="lg">
          {__('No recent tasks')}
        </Title>
        <EmptyStateBody>{emptyMessage || __('No tasks have been run yet.')}</EmptyStateBody>
      </EmptyState>
    );
  }

  const getProgressVariant = () => {
    if (task.state !== 'stopped') return ProgressVariant.info;
    if (task.result === 'success') return ProgressVariant.success;
    if (task.result === 'error') return ProgressVariant.danger;
    if (task.result === 'warning') return ProgressVariant.warning;
    return ProgressVariant.info;
  };

  const getStateLabel = () => {
    if (task.state === 'running') return __('Running');
    if (task.state === 'paused') return __('Paused');
    if (task.state === 'stopped') {
      if (task.result === 'success') return __('Completed successfully');
      if (task.result === 'error') return __('Failed');
      if (task.result === 'warning') return __('Completed with warnings');
      return __('Stopped');
    }
    return task.state;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <Card className="task-progress-card">
      {title && <CardTitle>{title}</CardTitle>}
      <CardBody>
        <Progress
          value={task.progress || 0}
          title={getStateLabel()}
          variant={getProgressVariant()}
          measureLocation="outside"
          aria-label="task-progress"
        />
        <DescriptionList isHorizontal className="task-progress-details">
          <DescriptionListGroup>
            <DescriptionListTerm>{__('Started')}</DescriptionListTerm>
            <DescriptionListDescription>
              <RelativeDateTime date={task.started_at} />
            </DescriptionListDescription>
          </DescriptionListGroup>
          {task.ended_at && (
            <DescriptionListGroup>
              <DescriptionListTerm>{__('Duration')}</DescriptionListTerm>
              <DescriptionListDescription>
                {formatDuration(task.duration)}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
        <Button
          component="a"
          href={`/foreman_tasks/tasks/${task.id}`}
          variant="link"
          isInline
        >
          {__('View Task Details')} →
        </Button>
      </CardBody>
    </Card>
  );
};

TaskProgress.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    result: PropTypes.string,
    progress: PropTypes.number,
    started_at: PropTypes.string,
    ended_at: PropTypes.string,
    duration: PropTypes.number,
  }),
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
};

TaskProgress.defaultProps = {
  task: null,
  title: null,
  emptyMessage: null,
};

export default TaskProgress;
