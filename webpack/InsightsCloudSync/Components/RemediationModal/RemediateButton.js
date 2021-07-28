import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

const RemediateButton = ({ selectedIds, toggleModal }) => (
  <Button
    variant="primary"
    isDisabled={isEmpty(selectedIds)}
    onClick={() => {
      toggleModal();
    }}
  >
    {__('Remediate')}
  </Button>
);

RemediateButton.propTypes = {
  selectedIds: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
};

RemediateButton.defaultProps = {
  selectedIds: {},
};

export default RemediateButton;
