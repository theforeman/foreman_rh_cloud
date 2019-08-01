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
          status={status}
          initExpanded={index === 0}
        />
      );
    });
    return <ListView>{items}</ListView>;
  }
}

AccountList.propTypes = {
  statuses: PropTypes.object,
  fetchAccountsStatus: PropTypes.func,
  startAccountStatusPolling: PropTypes.func,
  stopAccountStatusPolling: PropTypes.func,
  pollingProcessID: PropTypes.number,
};

AccountList.defaultProps = {
  statuses: {},
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID: 0,
};

export default AccountList;
