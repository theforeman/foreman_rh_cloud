import React from 'react';
import { Grid } from 'patternfly-react';
import InventoryFilter from '../InventoryFilter';
import ToolbarButtons from './components/ToolbarButtons';
import SettingsWarning from './components/SettingsWarning';
import PageTitle from './PageTitle';
import './PageHeader.scss';

const PageHeader = () => (
  <div className="inventory-upload-header">
    <SettingsWarning />
    <PageTitle />
    <Grid.Row>
      <Grid.Col xs={4}>
        <InventoryFilter />
      </Grid.Col>
      <Grid.Col xs={7} xsOffset={1}>
        <ToolbarButtons />
      </Grid.Col>
    </Grid.Row>
  </div>
);

PageHeader.propTypes = {};

PageHeader.defaultProps = {};

export default PageHeader;
