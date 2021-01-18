import React from 'react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';

const ForemanInventoryUpload = () => (
  <div className="rh-cloud-page">
    <PageLayout searchable={false} beforeToolbarComponent={<PageHeader />}>
      <AccountList />
    </PageLayout>
  </div>
);

ForemanInventoryUpload.propTypes = {};

ForemanInventoryUpload.defaultProps = {};

export default ForemanInventoryUpload;
