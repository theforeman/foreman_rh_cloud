import React from 'react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';
import { INVENTORY_PAGE_TITLE } from './ForemanInventoryConstants';

const ForemanInventoryUpload = () => (
  <div className="rh-cloud-page">
    <PageLayout
      header={INVENTORY_PAGE_TITLE}
      searchable={false}
      beforeToolbarComponent={<PageHeader />}
    >
      <AccountList />
    </PageLayout>
  </div>
);

ForemanInventoryUpload.propTypes = {};

ForemanInventoryUpload.defaultProps = {};

export default ForemanInventoryUpload;
