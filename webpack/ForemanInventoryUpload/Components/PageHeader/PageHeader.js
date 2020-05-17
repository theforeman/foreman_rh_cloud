import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import AutoUploadSwitcher from '../AutoUploadSwitcher';
import InventoryFilter from '../InventoryFilter';
import { INVENTORY_PAGE_TITLE } from '../../ForemanInventoryConstants';
import './pageHeader.scss';

const PageHeader = ({ currentOrg }) => (
  <React.Fragment>
    <Grid.Row>
      <Grid.Col xs={12}>
        <h1 className="inventory_title">{INVENTORY_PAGE_TITLE}</h1>
      </Grid.Col>
    </Grid.Row>
    <Grid.Row>
      <Grid.Col xs={3}>
        <InventoryFilter initialValue={currentOrg} />
      </Grid.Col>
      <Grid.Col xs={4} xsOffset={5}>
        <AutoUploadSwitcher />
      </Grid.Col>
    </Grid.Row>
  </React.Fragment>
);

PageHeader.propTypes = {
  currentOrg: PropTypes.string,
};

PageHeader.defaultProps = {
  currentOrg: '',
};

export default PageHeader;
