import React from 'react';
import { Grid } from 'patternfly-react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';
import { INVENTORY_PAGE_TITLE } from './ForemanInventoryConstants';

const ForemanInventoryUpload = () => (
  <PageLayout
    header={INVENTORY_PAGE_TITLE}
    searchable={false}
    beforeToolbarComponent={<PageHeader />}
  >
    <Grid fluid className="inventory-upload">
      <AccountList />
    </Grid>
  </PageLayout>
);

ForemanInventoryUpload.propTypes = {};

ForemanInventoryUpload.defaultProps = {};

export default ForemanInventoryUpload;
