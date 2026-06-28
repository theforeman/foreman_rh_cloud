import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import InventorySettings from '../InventorySettings';
import PageDescription from './components/PageDescription';
import InventoryFilter from '../InventoryFilter';
import ToolbarButtons from './components/ToolbarButtons';
import PageTitle from './PageTitle';
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';
import './PageHeader.scss';

const PageHeader = () => {
  const isIop = useIopConfig();

  return (
    <div className="inventory-upload-header">
      <PageTitle />
      {!isIop && (
        <div className="inventory-upload-header-description">
          <InventorySettings />
          <PageDescription />
        </div>
      )}
      <Grid hasGutter>
        <GridItem span={4}>
          <InventoryFilter />
        </GridItem>
        <GridItem span={8}>
          <ToolbarButtons />
        </GridItem>
      </Grid>
    </div>
  );
};

PageHeader.propTypes = {};

PageHeader.defaultProps = {};

export default PageHeader;
