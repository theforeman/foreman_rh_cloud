import React from 'react';
import { Grid } from 'patternfly-react';
import InventorySettings from '../InventorySettings';
import PageDescription from './components/PageDescription';
import InventoryFilter from '../InventoryFilter';
import ToolbarButtons from './components/ToolbarButtons';
import './PageHeader.scss';

const PageHeader = () => (
  <React.Fragment>
    <div className="inventory-upload-header">
      <InventorySettings />
      <PageDescription />
    </div>
    <Grid.Row>
      <Grid.Col xs={4}>
        <InventoryFilter />
      </Grid.Col>
      <Grid.Col xs={6} xsOffset={2}>
        <ToolbarButtons />
      </Grid.Col>
    </Grid.Row>
  </React.Fragment>
);

PageHeader.propTypes = {};

PageHeader.defaultProps = {};

export default PageHeader;
