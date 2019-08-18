import React, { Component } from 'react';
import { ListView, noop } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItem from './Components/ListItem';
import EmptyState from './Components/EmptyState';
import ErrorState from './Components/ErrorState';
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
    const { statuses, error } = this.props;
    const accountNames = Object.keys(statuses);

    if (error) {
      return <ErrorState error={error} />;
    }

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
    return <ListView className="account_list">{items}</ListView>;
  }
}

AccountList.propTypes = {
  fetchAccountsStatus: PropTypes.func,
  startAccountStatusPolling: PropTypes.func,
  stopAccountStatusPolling: PropTypes.func,
  pollingProcessID: PropTypes.number,
  statuses: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
  error: PropTypes.string,
};

AccountList.defaultProps = {
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID: 0,
  statuses: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
  },
  error: '',
};

export default AccountList;
