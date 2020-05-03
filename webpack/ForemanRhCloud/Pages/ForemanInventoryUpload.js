import React from 'react';
import { Grid } from 'patternfly-react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { translate as __ } from 'foremanReact/common/I18n';
import AccountList from '../Components/AccountList';
import PageHeader from '../Components/PageHeader';

const ForemanInventoryUpload = () => (
  <PageLayout header={__('Red Hat Inventory Upload')} searchable={false}>
    <Grid fluid className="inventory-upload">
      <PageHeader />
      <AccountList />
    </Grid>
  </PageLayout>
);

export default ForemanInventoryUpload;
