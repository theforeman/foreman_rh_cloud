import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Icon, DropdownItem, Dropdown, DropdownToggle, DropdownToggleAction } from 'patternfly-react';
import { noop } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { isExitCodeLoading } from '../../ForemanInventoryHelpers';
import './tabHeader.scss';

const onActionToggle = () => {
  setIsActionOpen(prev => !prev);
};

const dropdownItems = [
  <DropdownItem
    aria-label="restart_disconnected"
    ouiaId="restart_disconnected"
    key="restart_disconnected"
    component="button"
    onClick={restartDisconnected}
    isDisabled={isExitCodeLoading(exitCode)}
  >
    {__('Restart without uploading')}
  </DropdownItem>,
];

const TabHeader = ({ exitCode, onRestart, onDownload, restartDisconnected, toggleFullScreen }) => (
  <Grid.Row className="tab-header">
    <Grid.Col sm={6}>
      <p>{sprintf(__('Exit Code: %s'), exitCode)}</p>
    </Grid.Col>
    <Grid.Col sm={6}>
      <div className="tab-action-buttons">
        {onRestart ? (
          <Dropdown
          aria-label="restart_dropdown"
          ouiaId="restart_dropdown"
          toggle={
            <DropdownToggle
              aria-label="restart_report_toggle"
              ouiaId="restart_report_toggle"
              splitButtonItems={[
                <DropdownToggleAction key="action" aria-label="bulk_actions" onClick={onRestart}>
                  {__('Restart')}
                </DropdownToggleAction>,
              ]}
              splitButtonVariant="action"
              toggleVariant="primary"
              onToggle={onActionToggle}
              isDisabled={isExitCodeLoading(exitCode)}
            />
        }
          isOpen={isActionOpen}
          dropdownItems={dropdownItems}
        />
        ) : null}
        {onDownload ? (
          <Button onClick={onDownload}>
            {__('Download Report')} <Icon name="download" />
          </Button>
        ) : null}
        <Button onClick={toggleFullScreen}>
          {__('Full Screen')}
          <Icon name="arrows-alt" />
        </Button>
      </div>
    </Grid.Col>
  </Grid.Row>
);

TabHeader.propTypes = {
  onRestart: PropTypes.func,
  onDownload: PropTypes.func,
  exitCode: PropTypes.string,
  toggleFullScreen: PropTypes.func,
};

TabHeader.defaultProps = {
  onRestart: null,
  exitCode: '',
  onDownload: null,
  toggleFullScreen: noop,
};

export default TabHeader;
