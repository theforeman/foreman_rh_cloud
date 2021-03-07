import React, { Component } from 'react';
import { ListView, noop } from 'patternfly-react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import ListItem from './Components/ListItem';
import EmptyState from './Components/EmptyState';
import ErrorState from './Components/ErrorState';
import EmptyResults from './Components/EmptyResults';
import { filterAccounts } from './AccountListHelper';
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
    const { accounts, error, filterTerm } = this.props;
    const filteredAccount = filterAccounts(accounts, filterTerm);

    if (error) {
      return <ErrorState error={error} />;
    }

    if (isEmpty(accounts)) {
      return <EmptyState />;
    }

    if (isEmpty(filteredAccount)) {
      return <EmptyResults />;
    }

    const items = Object.keys(filteredAccount).map((label, index) => {
      const account = accounts[label];
      return <ListItem key={index} label={label} account={account} />;
    });
    return <ListView className="account_list">{items}</ListView>;
  }
}

AccountList.propTypes = {
  fetchAccountsStatus: PropTypes.func,
  startAccountStatusPolling: PropTypes.func,
  stopAccountStatusPolling: PropTypes.func,
  pollingProcessID: PropTypes.number,
  account: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
  accounts: PropTypes.object,
  error: PropTypes.string,
  filterTerm: PropTypes.string,
};

AccountList.defaultProps = {
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID: 0,
  account: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
  },
  accounts: {},
  error: '',
  filterTerm: null,
};

export default AccountList;
