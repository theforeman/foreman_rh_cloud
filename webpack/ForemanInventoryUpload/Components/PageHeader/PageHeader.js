import React from 'react';
import { Grid } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import AutoUploadSwitcher from '../AutoUploadSwitcher';

const PageHeader = () => (
  <React.Fragment>
    <Grid.Row>
      <Grid.Col xs={12}>
        <h1>{__('Red Hat Inventory Uploads')}</h1>
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
