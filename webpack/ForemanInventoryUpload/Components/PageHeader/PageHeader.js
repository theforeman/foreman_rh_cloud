import React from 'react';
import { Grid } from 'patternfly-react';
import AutoUploadSwitcher from '../AutoUploadSwitcher';
import { INVENTORY_PAGE_TITLE } from '../../ForemanInventoryConstants';

const PageHeader = () => (
  <React.Fragment>
    <Grid.Row>
      <Grid.Col xs={12}>
        <h1>{INVENTORY_PAGE_TITLE}</h1>
      </Grid.Col>
    </Grid.Row>
    <Grid.Row>
      <Grid.Col xs={4} xsOffset={8}>
        <AutoUploadSwitcher />
      </Grid.Col>
    </Grid.Row>
  </React.Fragment>
);

export default PageHeader;
