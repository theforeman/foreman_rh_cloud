import { combineReducers } from 'redux';
import { reducers as accountListReducers } from './Components/AccountList';
import { reducers as dashboardReducers } from './Components/Dashboard';
import { reducers as filterReducers } from './Components/InventoryFilter';

export default {
  inventoryUpload: combineReducers({
    ...accountListReducers,
    ...dashboardReducers,
    ...filterReducers,
  }),
};
