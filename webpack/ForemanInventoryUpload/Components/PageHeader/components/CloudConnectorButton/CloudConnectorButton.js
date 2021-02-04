import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner, Button, Popover } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { CONNECTOR_STATUS } from './CloudConnectorConstants';

export const CloudConnectorButton = ({ status, onClick, jobLink }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  if (status === CONNECTOR_STATUS.PENDING) {
    return (
      <Popover
        isVisible={isPopoverVisible}
        shouldClose={() => setIsPopoverVisible(false)}
        bodyContent={
          <div>
            {__('Cloud connector setup has started: ')}
            <a href={jobLink} target="_blank" rel="noopener noreferrer">
              {__('view the job in progress')}
            </a>
          </div>
        }
        aria-label="Popover with Link to cloud connector job"
        closeBtnAriaLabel="Close cloud connector Popover"
      >
        <div
          classnmae="cloud-connector-pending-button"
          onMouseEnter={() => setIsPopoverVisible(true)}
        >
          <Button variant="secondary" isDisabled>
            <Spinner size="sm" /> {__('Cloud Connector is in progress')}
          </Button>
        </div>
      </Popover>
    );
  }

  if (status === CONNECTOR_STATUS.RESOLVED) {
    return (
      <Button variant="secondary" onClick={onClick}>
        {__('Reconfigure Cloud Connector')}
      </Button>
    );
  }

  return (
    <Button variant="secondary" onClick={onClick}>
      {__('Configure Cloud Connector')}
    </Button>
  );
};

CloudConnectorButton.propTypes = {
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  jobLink: PropTypes.string,
};
CloudConnectorButton.defaultProps = {
  jobLink: '',
};
