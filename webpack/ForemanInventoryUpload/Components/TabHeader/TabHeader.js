import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Button, Icon } from 'patternfly-react';
import { Tooltip } from '@patternfly/react-core';
import { noop } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { selectSubscriptionConnectionEnabled } from '../InventorySettings/InventorySettingsSelectors';
import { isExitCodeLoading } from '../../ForemanInventoryHelpers';
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';
import './tabHeader.scss';

const TabHeader = ({
  exitCode,
  onRestart,
  onDownload,
  downloadButtonDisabled,
  toggleFullScreen,
}) => {
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );
  const isIop = Boolean(useIopConfig());
  const buttonGenerateLabel = subscriptionConnectionEnabled
    ? __('Generate and upload report')
    : __('Generate report');

  const isUploadDisabled = !isIop && !subscriptionConnectionEnabled;
  const isButtonDisabled = isExitCodeLoading(exitCode) || isUploadDisabled;
  const tooltipContent = __(
    'Upload is disabled because subscription connection is not enabled. Enable it in Administer > Settings > Content.'
  );

  const generateButton = onRestart ? (
    <Button bsStyle="primary" onClick={onRestart} disabled={isButtonDisabled}>
      {buttonGenerateLabel}
    </Button>
  ) : null;

  return (
    <Grid.Row className="tab-header">
      <Grid.Col sm={6}>
        <p>{sprintf(__('Exit Code: %s'), exitCode)}</p>
      </Grid.Col>
      <Grid.Col sm={6}>
        <div className="tab-action-buttons">
          {generateButton && isUploadDisabled ? (
            <Tooltip content={tooltipContent}>
              <div style={{ display: 'inline-block' }}>{generateButton}</div>
            </Tooltip>
          ) : (
            generateButton
          )}
          {onDownload ? (
            <Button onClick={onDownload} disabled={downloadButtonDisabled()}>
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
};

TabHeader.propTypes = {
  onRestart: PropTypes.func,
  onDownload: PropTypes.func,
  exitCode: PropTypes.string,
  downloadButtonDisabled: PropTypes.func,
  toggleFullScreen: PropTypes.func,
};

TabHeader.defaultProps = {
  onRestart: null,
  exitCode: '',
  onDownload: null,
  downloadButtonDisabled: noop,
  toggleFullScreen: noop,
};

export default TabHeader;
