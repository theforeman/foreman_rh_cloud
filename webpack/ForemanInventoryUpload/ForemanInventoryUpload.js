import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Grid } from 'patternfly-react';
import AccountList from './Components/AccountList';
import PageHeader from './Components/PageHeader';
import { INVENTORY_PAGE_TITLE } from './ForemanInventoryConstants';

const ForemanInventoryUpload = ({ currentOrg }) => {
  document.title = INVENTORY_PAGE_TITLE;
  return (
    <IntlProvider locale={navigator.language}>
      <Grid fluid className="inventory-upload">
        <PageHeader currentOrg={currentOrg} />
        <AccountList />
      </Grid>
    </IntlProvider>
  );
};

ForemanInventoryUpload.propTypes = {
  currentOrg: PropTypes.string,
};

ForemanInventoryUpload.defaultProps = {
  currentOrg: '',
};

export default ForemanInventoryUpload;
