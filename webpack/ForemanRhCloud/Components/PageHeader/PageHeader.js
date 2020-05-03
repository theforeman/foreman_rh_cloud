import React from 'react';
import { Grid } from 'patternfly-react';
import AutoUploadSwitcher from '../AutoUploadSwitcher';

const PageHeader = () => (
  <Grid.Row>
    <Grid.Col xs={4} xsOffset={8}>
      <AutoUploadSwitcher />
    </Grid.Col>
  </Grid.Row>
);

export default PageHeader;
