import React from 'react';
import { IntlProvider } from 'react-intl';
import { Grid } from 'patternfly-react';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';

const ForemanInventoryUpload = () => (
  <IntlProvider locale={navigator.language}>
    <Grid fluid className="inventory-upload">
      <PageHeader />
      <AccountList />
    </Grid>
  </IntlProvider>
);

export default ForemanInventoryUpload;
