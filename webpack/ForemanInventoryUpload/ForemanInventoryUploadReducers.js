import { combineReducers } from 'redux';
import { reducers as accountListReducers } from './Components/AccountList';
import { reducers as dashboardReducers } from './Components/Dashboard';

export default {
  inventoryUpload: combineReducers({
    ...accountListReducers,
    ...dashboardReducers,
  }),
};
