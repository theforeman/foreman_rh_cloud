import React, { Component } from 'react';
import { ListView, noop } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItem from './Components/ListItem';
import EmptyState from './Components/EmptyState';
import './accountList.scss';

class AccountList extends Component {
  componentDidMount() {
    const { fetchAccountsStatus, startAccountStatusPolling } = this.props;
    fetchAccountsStatus();
    const pollingProcessID = setInterval(fetchAccountsStatus, 5000);
    startAccountStatusPolling(pollingProcessID);
  }

  componentWillUnmount() {
    const { stopAccountStatusPolling, pollingProcessID } = this.props;
    stopAccountStatusPolling(pollingProcessID);
  }

  render() {
    const { statuses } = this.props;
    const accountNames = Object.keys(statuses);
    if (accountNames.length === 0) {
      return <EmptyState />;
    }
    const items = accountNames.map((name, index) => {
      const status = statuses[name];
      return (
        <ListItem
          key={index}
          name={name}
          statuses={status}
          initExpanded={index === 0}
        />
      );
    });
    return <ListView>{items}</ListView>;
  }
}

AccountList.propTypes = {
  fetchAccountsStatus: PropTypes.func,
  startAccountStatusPolling: PropTypes.func,
  stopAccountStatusPolling: PropTypes.func,
  pollingProcessID: PropTypes.number,
  statuses: PropTypes.shape({
    generating: PropTypes.string,
    uploading: PropTypes.string,
  }),
};

AccountList.defaultProps = {
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID: 0,
  statuses: {
    generating: 'unknown',
    uploading: 'unknown',
  },
};

export default AccountList;
