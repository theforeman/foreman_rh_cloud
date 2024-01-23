/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant } from '@patternfly/react-core';
import PageDescription from '../PageDescription';

const AboutModal = ({ isOpen, toggle, title }) => (
  <Modal
    id="rh-cloud-about-modal"
    appendTo={document.getElementsByClassName('react-container')[0]}
    variant={ModalVariant.large}
    title={title}
    isOpen={isOpen}
    onClose={toggle}
  >
    <PageDescription />
  </Modal>
);

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default AboutModal;
