/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
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
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import { ClockIcon, DownloadIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import RelativeDateTime from 'foremanReact/components/common/dates/RelativeDateTime';
import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import { selectSubscriptionConnectionEnabled } from '../InventorySettings/InventorySettingsSelectors';
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';
import './taskProgress.scss';

const TaskProgress = ({
  task,
  title,
  emptyMessage,
  organizationId,
  taskType,
  onTaskStart,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [lastTaskId, setLastTaskId] = useState(null);

  // Clear lastTaskId when the task data updates to match it
  useEffect(() => {
    if (lastTaskId && task?.id === lastTaskId) {
      setLastTaskId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, lastTaskId]);

  // Track when a new task starts so we can show optimistic UI
  // Show optimistic UI if we've started a new task but haven't received the updated task data yet
  const isStartingNewTask = lastTaskId && task?.id !== lastTaskId;

  // Check IoP mode and subscription connection settings
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );
  const isIop = Boolean(useIopConfig());
  const isUploadDisabled = !isIop && !subscriptionConnectionEnabled;
  const uploadDisabledTooltip = __(
    'Upload is disabled because subscription connection is not enabled. Enable it in Administer > Settings > Content.'
  );

  const handleGenerateReport = async disconnected => {
    setIsLoading(true);
    try {
      const { data } = await API.post(
        inventoryUrl(`${organizationId}/reports`),
        {
          disconnected,
        }
      );

      // Update last task ID only if it's a new task
      if (data.id !== task?.id) {
        setLastTaskId(data.id);
      }

      // Trigger immediate poll to update UI faster
      if (onTaskStart) {
        onTaskStart();
      }

      // Use Katello's toast notification pattern with task link
      const message = disconnected
        ? __('Report generation started')
        : __('Report generation and upload started');

      window.tfm.toastNotifications.notify({
        message,
        type: 'info',
        link: {
          children: __('Go to task page'),
          href: `/foreman_tasks/tasks/${data.id}`,
        },
      });
    } catch (error) {
      dispatch(
        addToast({
          sticky: true,
          type: 'error',
          message: error.message,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.location.href = `/api/v2/organizations/${organizationId}/rh_cloud/report`;
  };

  if (!task) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={ClockIcon} />
        <Title headingLevel="h4" size="lg">
          {__('No recent tasks')}
        </Title>
        <EmptyStateBody>
          {emptyMessage || __('No tasks have been run yet.')}
        </EmptyStateBody>
        {taskType === 'generate' && organizationId && (
          <Flex className="task-progress-actions">
            <FlexItem>
              {isUploadDisabled ? (
                <Tooltip content={uploadDisabledTooltip}>
                  <span>
                    <Button
                      ouiaId="generate-and-upload-disabled-button"
                      variant="primary"
                      onClick={() => handleGenerateReport(false)}
                      isDisabled
                    >
                      {__('Generate and upload report')}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  ouiaId="generate-and-upload-button"
                  variant="primary"
                  onClick={() => handleGenerateReport(false)}
                  isDisabled={isLoading}
                >
                  {__('Generate and upload report')}
                </Button>
              )}
            </FlexItem>
            <FlexItem>
              <Button
                variant="secondary"
                onClick={() => handleGenerateReport(true)}
                isDisabled={isLoading}
              >
                {__('Generate report')}
              </Button>
            </FlexItem>
          </Flex>
        )}
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
      if (task.result === 'success') return __('Completed');
      if (task.result === 'error') return __('Failed');
      if (task.result === 'warning') return __('Completed with warnings');
      return __('Stopped');
    }
    return task.state;
  };

  const formatDuration = seconds => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const isTaskRunning = task.state === 'running' || task.state === 'paused';

  // Buttons should be disabled if loading, task is running, or we're waiting for new task data
  const areButtonsDisabled = isLoading || isTaskRunning || isStartingNewTask;

  // Show 100% for completed tasks, otherwise use reported progress
  // If starting a new task, show 0% to give immediate feedback
  let progressValue = 0;
  if (isStartingNewTask) {
    progressValue = 0;
  } else if (task.state === 'stopped') {
    progressValue = 100;
  } else {
    progressValue = task.progress || 0;
  }

  // Override state label and variant when starting new task
  const displayStateLabel = isStartingNewTask ? __('Running') : getStateLabel();
  const displayVariant = isStartingNewTask
    ? ProgressVariant.info
    : getProgressVariant();

  return (
    <Card className="task-progress-card">
      {title && <CardTitle>{title}</CardTitle>}
      <CardBody>
        <Progress
          value={progressValue}
          title={displayStateLabel}
          variant={displayVariant}
          measureLocation="outside"
          aria-label="task-progress"
        />
        <DescriptionList isHorizontal className="task-progress-details">
          <DescriptionListGroup>
            <DescriptionListTerm>{__('Started')}</DescriptionListTerm>
            <DescriptionListDescription>
              {!isStartingNewTask && (
                <RelativeDateTime date={task.started_at} />
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{__('Duration')}</DescriptionListTerm>
            <DescriptionListDescription>
              {!isStartingNewTask && formatDuration(task.duration)}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{__('Report saved to')}</DescriptionListTerm>
            <DescriptionListDescription>
              {!isStartingNewTask && task.report_file_path}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <Flex className="task-progress-actions">
          <FlexItem>
            <Button
              component="a"
              href={`/foreman_tasks/tasks/${task.id}`}
              variant="link"
              isInline
            >
              {__('View task details')}
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              variant="secondary"
              onClick={handleDownloadReport}
              icon={<DownloadIcon />}
              isDisabled={!task.report_file_path || areButtonsDisabled}
            >
              {__('Download report')}
            </Button>
          </FlexItem>
          {taskType === 'generate' && organizationId && (
            <>
              <FlexItem>
                {isUploadDisabled ? (
                  <Tooltip content={uploadDisabledTooltip}>
                    <span>
                      <Button
                        ouiaId="generate-and-upload-disabled-button-task-view"
                        variant="primary"
                        onClick={() => handleGenerateReport(false)}
                        isDisabled
                      >
                        {__('Generate and upload report')}
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    ouiaId="generate-and-upload-button-task-view"
                    variant="primary"
                    onClick={() => handleGenerateReport(false)}
                    isDisabled={areButtonsDisabled}
                  >
                    {__('Generate and upload report')}
                  </Button>
                )}
              </FlexItem>
              <FlexItem>
                <Button
                  variant="secondary"
                  onClick={() => handleGenerateReport(true)}
                  isDisabled={areButtonsDisabled}
                >
                  {__('Generate report')}
                </Button>
              </FlexItem>
            </>
          )}
        </Flex>
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
    report_file_path: PropTypes.string,
  }),
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  taskType: PropTypes.oneOf(['generate', 'upload']),
  onTaskStart: PropTypes.func,
};

TaskProgress.defaultProps = {
  task: null,
  title: null,
  emptyMessage: null,
  organizationId: null,
  taskType: null,
  onTaskStart: null,
};

export default TaskProgress;
