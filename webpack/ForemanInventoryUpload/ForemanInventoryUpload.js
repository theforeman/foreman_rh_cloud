import React from 'react';
import { IntlProvider } from 'react-intl';
import AccountList from './Components/AccountList';

const ForemanInventoryUpload = () => (
  <IntlProvider locale={navigator.language}>
    <div className="inventory-upload">
      <h1>Red Hat Inventory Uploads</h1>
      <AccountList />
    </div>
  </IntlProvider>
);

export default ForemanInventoryUpload;
