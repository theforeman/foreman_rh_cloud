import React from 'react';
import { Grid } from 'patternfly-react';
import InventorySettings from '../InventorySettings';
import PageDescription from './components/PageDescription';
import InventoryFilter from '../InventoryFilter';
import ToolbarButtons from './components/ToolbarButtons';
import { INVENTORY_PAGE_TITLE } from '../../ForemanInventoryConstants';
import './pageHeader.scss';

const PageHeader = () => (
  <React.Fragment>
    <Grid.Row>
      <Grid.Col xs={6}>
        <h1 className="inventory_title">{INVENTORY_PAGE_TITLE}</h1>
      </Grid.Col>
    </Grid.Row>
    <Grid.Row>
      <Grid.Col xs={9}>
        <PageDescription />
      </Grid.Col>
      <Grid.Col xs={3}>
        <InventorySettings />
      </Grid.Col>
    </Grid.Row>
    <Grid.Row>
      <Grid.Col xs={4}>
        <InventoryFilter />
      </Grid.Col>
      <Grid.Col xs={4} xsOffset={4}>
        <ToolbarButtons />
      </Grid.Col>
    </Grid.Row>
  </React.Fragment>
);

PageHeader.propTypes = {};

PageHeader.defaultProps = {};

export default PageHeader;
