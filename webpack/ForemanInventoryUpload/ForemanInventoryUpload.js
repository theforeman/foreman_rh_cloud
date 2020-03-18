import React from 'react';
import { IntlProvider } from 'react-intl';
import { translate as __ } from 'foremanReact/common/I18n';
import { Battery, Section } from '@redhat-cloud-services/frontend-components';
import AccountList from './Components/AccountList';
import './foremanInventoryUpload.scss';

const ForemanInventoryUpload = () => (
  <IntlProvider locale={navigator.language}>
    <div className="inventory-upload">
      <h1>{__('Red Hat Inventory Uploads')}</h1>
      <AccountList />
      <Section type="icon-group">
        <Battery label="test" severity="critical" />
      </Section>
    </div>
  </IntlProvider>
);

export default ForemanInventoryUpload;
