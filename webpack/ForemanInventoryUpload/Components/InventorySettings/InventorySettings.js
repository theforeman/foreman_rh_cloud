import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button } from '@patternfly/react-core';
import AdvancedSettingsModal from './AdvancedSettingsModal';
import RedHatInventorySwitcher from './RedHatInventorySwitcher';
import './InventorySettings.scss';

const InventorySettings = ({ handleToggleRHInventory, rhInventory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="inventory-settings">
      <h3>{__('Settings')}</h3>
      <RedHatInventorySwitcher
        isEnabled={rhInventory}
        handleToggle={handleToggleRHInventory}
      />
      <Button variant="link" isInline onClick={() => setIsModalOpen(true)}>
        {__('View advanced settings')}
      </Button>
      <AdvancedSettingsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

InventorySettings.propTypes = {
  handleToggleRHInventory: PropTypes.func.isRequired,
  rhInventory: PropTypes.bool.isRequired,
};

export default InventorySettings;
