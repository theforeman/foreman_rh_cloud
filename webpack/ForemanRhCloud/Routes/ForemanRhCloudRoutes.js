import React from 'react';
import ForemanInventoryUpload from '../Pages/ForemanInventoryUpload';

const ForemanRhCloudRoutes = {
  indexInventoryUpload: {
    path: '/foreman_inventory_upload/index',
    exact: true,
    render: props => <ForemanInventoryUpload {...props} />,
  },
};

export default ForemanRhCloudRoutes;
