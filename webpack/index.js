/* eslint import/no-unresolved: [2, { ignore: [foremanReact/*] }] */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import componentRegistry from 'foremanReact/components/componentRegistry';
import { registerReducer } from 'foremanReact/common/MountingService';
import reducers from './ForemanRhCloudReducers';
import ForemanInventoryUpload from './ForemanInventoryUpload';

// register reducers
Object.entries(reducers).forEach(([key, reducer]) =>
  registerReducer(key, reducer)
);

// register components
componentRegistry.register({
  name: 'ForemanInventoryUpload',
  type: ForemanInventoryUpload,
});
