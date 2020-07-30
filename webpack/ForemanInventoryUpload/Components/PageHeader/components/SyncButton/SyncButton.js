import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Spinner } from 'patternfly-react';
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
        <Button className="sync_button" onClick={handleClick} bsSize="lg">
          {!cloudToken && (
            <span>
              <Icon name="warning" />{' '}
            </span>
          )}
          {status === STATUS.PENDING ? (
            <Spinner loading size="xs" />
          ) : (
            <Icon name="refresh" />
          )}
          {SYNC_BUTTON_TEXT}
        </Button>
      </React.Fragment>
    );
  }
}

SyncButton.propTypes = {
  cloudToken: PropTypes.string.isRequired,
  handleSync: PropTypes.func.isRequired,
  status: PropTypes.string,
};

SyncButton.defaultProps = {
  status: null,
};

export default SyncButton;
