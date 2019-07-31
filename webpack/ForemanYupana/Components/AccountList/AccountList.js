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
        name: 'Acount 1',
        status: { uploading: 'running', generating: 'running' },
      },
      {
        name: 'Acount 2',
        status: { uploading: 'stopped', generating: 'failure' },
      },
      {
        name: 'Acount 3',
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
