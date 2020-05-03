import React from 'react';
import { Grid } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import AccountList from '../Components/AccountList';
import PageHeader from '../Components/PageHeader';
import PageLayout from '../../__mocks__/foremanReact/routes/common/PageLayout/PageLayout';

const ForemanInventoryUpload = () => (
  <PageLayout header={__('Red Hat Inventory Upload')} searchable={false}>
    <Grid fluid className="inventory-upload">
      <PageHeader />
      <AccountList />
    </Grid>
  </PageLayout>
);

export default ForemanInventoryUpload;
