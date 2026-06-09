import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextVariants,
  Popover,
  Button,
  FormGroup,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { InfoAltIcon, CaretRightIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';
import SwitcherPF4 from '../../../common/Switcher/SwitcherPF4';
import { settingsDict } from '../../Components/InventorySettings/AdvancedSetting/AdvancedSettingsConstants';
import InventorySettings from '../../Components/InventorySettings/InventorySettings';

const InventoryAutoUploadSwitcher = ({
  autoUploadEnabled,
  setSetting,
  getSettings,
}) => {
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  const handleToggle = () =>
    setSetting({
      setting: settingsDict.autoUploadEnabled.name,
      value: !autoUploadEnabled,
    });
  return (
    <FormGroup>
      <Grid>
        <h3>{__('Red Hat Cloud Inventory')}</h3>
        <hr />
        <Grid hasGutter>
          <GridItem span={7}>
            <SwitcherPF4
              id="auto-upload"
              label={__('Inventory Auto Upload')}
              tooltip={__(
                'Enable automatic upload of your hosts inventory to the Red Hat cloud'
              )}
              isChecked={autoUploadEnabled}
              onChange={handleToggle}
            />
          </GridItem>
          <GridItem span={5}>
            <Popover
              headerContent={
                <strong>{__('Advanced Inventory Settings')}</strong>
              }
              bodyContent={<InventorySettings />}
              position="right"
            >
              <Button
                ouiaId="button-advanced-settings"
                variant="secondary"
                style={{ fontSize: 'small', marginTop: '-4px' }}
              >
                {__('Show Advanced Settings')} <CaretRightIcon />
              </Button>
            </Popover>
          </GridItem>
        </Grid>
        <br />
        <Grid>
          <GridItem span={12}>
            <Text component={TextVariants.p} ouiaId="text-more-details">
              <InfoAltIcon /> {__('More details can be found in')}{' '}
              <Text
                ouiaId="text-details-link"
                component={TextVariants.a}
                href={foremanUrl('/foreman_rh_cloud/inventory_upload')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>
                  {__('Configure')}
                  {' > '}
                  {__('Inventory Upload')}
                </strong>
              </Text>
            </Text>
          </GridItem>
        </Grid>
      </Grid>
    </FormGroup>
  );
};

InventoryAutoUploadSwitcher.propTypes = {
  autoUploadEnabled: PropTypes.bool,
  setSetting: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
};

InventoryAutoUploadSwitcher.defaultProps = {
  autoUploadEnabled: true,
};

export default InventoryAutoUploadSwitcher;
