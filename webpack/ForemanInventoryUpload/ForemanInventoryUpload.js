import React from 'react';
import { IntlProvider } from 'react-intl';
import { translate as __ } from 'foremanReact/common/I18n';
import AccountList from './Components/AccountList';

const ForemanInventoryUpload = () => (
  <IntlProvider locale={navigator.language}>
    <div className="inventory-upload">
      <h1>{__('Red Hat Inventory Uploads')}</h1>
      <AccountList />
    </div>
  </IntlProvider>
);

export default ForemanInventoryUpload;
