import React from 'react';
import Dashboard from './Components/Dashboard';
import {
  generating,
  uploading,
} from './Components/Dashboard/Dashboard.fixtures';

const ForemanYupana = () => (
  <Dashboard generating={generating} uploading={uploading} />
);

export default ForemanYupana;
