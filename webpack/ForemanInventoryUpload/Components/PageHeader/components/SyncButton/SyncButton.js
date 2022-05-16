import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Button } from '@patternfly/react-core';
import { RedoIcon } from '@patternfly/react-icons';
import { STATUS } from 'foremanReact/constants';
import { SYNC_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';

class SyncButton extends React.Component {
  state = {
    showModal: false,
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    const { handleSync, status } = this.props;

    const handleClick = handleSync;
    return (
      <React.Fragment>
        <Button
          className="sync_button"
          onClick={handleClick}
          size="lg"
          isDisabled={status === STATUS.PENDING}
          variant="secondary"
        >
          {status === STATUS.PENDING ? <Spinner size="sm" /> : <RedoIcon />}
          {SYNC_BUTTON_TEXT}
        </Button>
      </React.Fragment>
    );
  }
}

SyncButton.propTypes = {
  handleSync: PropTypes.func.isRequired,
  status: PropTypes.string,
};

SyncButton.defaultProps = {
  status: null,
};

export default SyncButton;
