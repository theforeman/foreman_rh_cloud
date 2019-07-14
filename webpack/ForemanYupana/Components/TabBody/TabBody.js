import React from 'react';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';
import StatusChart from '../StatusChart';

const TabBody = () => (
  <Grid.Row>
    <StatusChart />
    <Terminal />
  </Grid.Row>
);

export default TabBody;
