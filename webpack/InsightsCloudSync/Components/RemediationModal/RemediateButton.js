import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Button, Popover } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

const RemediateButton = ({ isExperimentalMode, selectedIds, toggleModal }) => {
  const [isVisible, setVisible] = React.useState(true);

  const popoverContent = __(
    `To use this feature, please enable <a href=${foremanUrl(
      '/settings?search=name+%3D+lab_features'
    )}>Show Experimental Labs</a> in settings.`
  );

  let button = (
    <Button
      variant="primary"
      isDisabled={isEmpty(selectedIds)}
      onClick={() => {
        if (!isExperimentalMode) {
          setVisible(value => !value);
        } else {
          toggleModal();
        }
      }}
    >
      {__('Remediate')}
    </Button>
  );

  if (!isExperimentalMode) {
    button = (
      <Popover
        isVisible={isVisible}
        bodyContent={
          <div dangerouslySetInnerHTML={{ __html: popoverContent }} />
        }
      >
        {button}
      </Popover>
    );
  }
  return button;
};

RemediateButton.propTypes = {
  selectedIds: PropTypes.object,
  isExperimentalMode: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

RemediateButton.defaultProps = {
  selectedIds: {},
  isExperimentalMode: false,
};

export default RemediateButton;
