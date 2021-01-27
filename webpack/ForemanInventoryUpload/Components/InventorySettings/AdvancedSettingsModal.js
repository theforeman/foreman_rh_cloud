import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import AdvancedSetting from './AdvancedSetting';
import { settingsDict } from './AdvancedSetting/AdvancedSettingsConstants';

const AdvancedSettingsModal = ({ isModalOpen, setIsModalOpen }) => (
  <Modal
    title={__('Advanced Settings')}
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    appendTo={() => document.getElementsByClassName('rh-cloud-page')[0]}
    variant={ModalVariant.small}
    className="inventory-advanced-settings"
  >
    <p>
      {__(
        'Red Hat Inventory and Cloud Connector use shared settings. Required settings differ for both'
      )}
    </p>
    {Object.keys(settingsDict).map(key => (
      <AdvancedSetting setting={key} key={key} />
    ))}
  </Modal>
);

AdvancedSettingsModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default AdvancedSettingsModal;
