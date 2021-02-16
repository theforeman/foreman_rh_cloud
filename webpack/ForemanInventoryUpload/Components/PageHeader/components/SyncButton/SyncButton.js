import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Button } from '@patternfly/react-core';
import { ExclamationTriangleIcon, RedoIcon } from '@patternfly/react-icons';
import { STATUS } from 'foremanReact/constants';
import SyncModal from './components/Modal';
import { SYNC_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';

class SyncButton extends React.Component {
  state = {
    showModal: false,
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    const { cloudToken, handleSync, status } = this.props;

    const handleClick = !cloudToken ? this.toggleModal : handleSync;
    return (
      <React.Fragment>
        <SyncModal show={this.state.showModal} toggleModal={this.toggleModal} />
        <Button
          className="sync_button"
          onClick={handleClick}
          size="lg"
          isDisabled={status === STATUS.PENDING}
          variant="secondary"
        >
          {!cloudToken && (
            <span>
              <ExclamationTriangleIcon />{' '}
            </span>
          )}
          {status === STATUS.PENDING ? <Spinner size="sm" /> : <RedoIcon />}
          {SYNC_BUTTON_TEXT}
        </Button>
      </React.Fragment>
    );
  }
}

SyncButton.propTypes = {
  cloudToken: PropTypes.bool,
  handleSync: PropTypes.func.isRequired,
  status: PropTypes.string,
};

SyncButton.defaultProps = {
  cloudToken: false,
  status: null,
};

export default SyncButton;
