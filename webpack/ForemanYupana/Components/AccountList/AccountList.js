import React, { Component } from 'react';
import { ListView } from 'patternfly-react';
import ListItem from './Components/ListItem/ListItem';
import './accountList.scss';

class AccountList extends Component {
  componentDidMount() {
    // Do Something here
  }

  render() {
    const mockList = [
      {
        name: 'Account 1',
        status: { uploading: 'running', generating: 'running' },
      },
      {
        name: 'Account 2',
        status: { uploading: 'stopped', generating: 'failure' },
      },
      {
        name: 'Account 3',
        status: { uploading: 'success', generating: 'running' },
      },
    ];
    return (
      <ListView>
        {mockList.map(({ name, status }, index) => (
          <ListItem
            key={index}
            name={name}
            status={status}
            initExpanded={index === 0}
          />
        ))}
      </ListView>
    );
  }
}

AccountList.propTypes = {};

AccountList.defaultProps = {};

export default AccountList;
