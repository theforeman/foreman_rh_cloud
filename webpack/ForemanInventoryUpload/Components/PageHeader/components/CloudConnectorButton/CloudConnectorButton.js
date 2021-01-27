import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Button, Popover } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { CONNECTOR_STATUS } from './CloudConnectorConstants';

export const CloudConnectorButton = ({ status, onClick, jobLink }) => {
  if (status === CONNECTOR_STATUS.PENDING) {
    return (
      <Popover
        bodyContent={
          <div>
            {__('Cloud connector job is still running, you can view it here:')}
            <a href={jobLink} target="_blank" rel="noopener noreferrer">
              {__('Open job')}
            </a>
          </div>
        }
        aria-label="Popover with Link to cloud connector job"
        closeBtnAriaLabel="Close cloud connector Popover"
      >
        <Button variant="secondary">
          <Spinner size="sm" /> {__('Cloud Connector in progress')}
        </Button>
      </Popover>
    );
  }

  if (status === CONNECTOR_STATUS.RESOLVED) {
    return (
      <Button variant="secondary" isDisabled>
        {__('Cloud Connector is configured')}
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
