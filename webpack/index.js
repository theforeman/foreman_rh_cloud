/* eslint import/no-unresolved: [2, { ignore: [foremanReact/*] }] */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import componentRegistry from 'foremanReact/components/componentRegistry';
import { registerReducer } from 'foremanReact/common/MountingService';
import reducers from './ForemanYupana/ForemanYupanaReducers';
import ForemanYupana from './ForemanYupana';
import TasksDashboard from './ForemanYupana/Components/TasksDashboard';

// register reducers
Object.entries(reducers).forEach(([key, reducer]) =>
  registerReducer(key, reducer)
);

// register components
componentRegistry.register({
  name: 'ForemanYupana',
  type: ForemanYupana,
});
componentRegistry.register({
  name: 'TasksDashboard',
  type: TasksDashboard,
});
