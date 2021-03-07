import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'patternfly-react';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import Terminal from '../Terminal';
import './fullScreenModal.scss';

const FullScreenModal = ({
  showFullScreen,
  toggleFullScreen,
  terminalProps,
}) => (
  <Modal
    id="full-screen-terminal"
    show={showFullScreen}
    onHide={toggleFullScreen}
  >
    <Modal.Header>
      <button
        className="close"
        onClick={toggleFullScreen}
        aria-hidden="true"
        aria-label="Close"
      >
        <Icon type="pf" name="close" />
      </button>
      <Modal.Title>{__('Full Screen')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Terminal autoScroll={false} {...terminalProps} />
    </Modal.Body>
  </Modal>
);

FullScreenModal.propTypes = {
  showFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  terminalProps: PropTypes.shape({
    exitCode: PropTypes.string,
    logs: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    error: PropTypes.string,
  }),
};

FullScreenModal.defaultProps = {
  showFullScreen: false,
  toggleFullScreen: noop,
  terminalProps: {},
};

export default FullScreenModal;
