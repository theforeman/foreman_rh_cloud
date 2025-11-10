import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { noop } from 'foremanReact/common/helpers';
import { Accordion } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ListItem from './Components/ListItem';
import EmptyState from './Components/EmptyState';
import ErrorState from './Components/ErrorState';
import EmptyResults from './Components/EmptyResults';
import { filterAccounts } from './AccountListHelper';
import './accountList.scss';

const AccountList = ({
  accounts,
  error,
  filterTerm,
  fetchAccountsStatus,
  startAccountStatusPolling,
  stopAccountStatusPolling,
  pollingProcessID,
}) => {
  useEffect(() => {
    fetchAccountsStatus();
    const pollingID = setInterval(fetchAccountsStatus, 2000);
    startAccountStatusPolling(pollingID);

    return () => {
      stopAccountStatusPolling(pollingID);
    };
  }, [
    fetchAccountsStatus,
    startAccountStatusPolling,
    stopAccountStatusPolling,
  ]);

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
    return (
      <ListItem
        key={label}
        label={label}
        account={account}
        defaultExpanded={index === 0}
        onTaskStart={fetchAccountsStatus}
      />
    );
  });
  return <Accordion className="account-list">{items}</Accordion>;
};

AccountList.propTypes = {
  fetchAccountsStatus: PropTypes.func,
  startAccountStatusPolling: PropTypes.func,
  stopAccountStatusPolling: PropTypes.func,
  pollingProcessID: PropTypes.number,
  account: PropTypes.shape({
    generated_status: PropTypes.string,
    uploaded_status: PropTypes.string,
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
    generated_status: 'unknown',
    uploaded_status: 'unknown',
  },
  accounts: {},
  error: '',
  filterTerm: null,
};

export default AccountList;
