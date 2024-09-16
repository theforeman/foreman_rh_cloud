/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant } from '@patternfly/react-core';
import InventorySettings from '../../../InventorySettings';

const SettingsModal = ({ isOpen, toggle, title }) => (
  <Modal
    id="about-modal"
    appendTo={document.getElementsByClassName('react-container')[0]}
    variant={ModalVariant.small}
    title={title}
    isOpen={isOpen}
    onClose={toggle}
  >
    <InventorySettings />
  </Modal>
);

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default SettingsModal;
