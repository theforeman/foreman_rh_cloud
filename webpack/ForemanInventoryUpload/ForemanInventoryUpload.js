import React from 'react';
import { IntlProvider } from 'react-intl';
import { Grid } from 'patternfly-react';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';
import { INVENTORY_PAGE_TITLE } from './ForemanInventoryConstants';

const ForemanInventoryUpload = () => {
  document.title = INVENTORY_PAGE_TITLE;
  return (
    <IntlProvider locale={navigator.language}>
      <Grid fluid className="inventory-upload">
        <PageHeader />
        <AccountList />
      </Grid>
    </IntlProvider>
  );
};

ForemanInventoryUpload.propTypes = {};

ForemanInventoryUpload.defaultProps = {};

export default ForemanInventoryUpload;
