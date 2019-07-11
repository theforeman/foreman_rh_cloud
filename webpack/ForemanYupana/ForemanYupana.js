import React from 'react';
import UploadsDashboard from './Components/UploadsDashboard';
import {
  generating,
  uploading,
} from './Components/UploadsDashboard/UploadsDashboard.fixtures';

const ForemanYupana = () => (
  <UploadsDashboard generating={generating} uploading={uploading} />
);

export default ForemanYupana;
