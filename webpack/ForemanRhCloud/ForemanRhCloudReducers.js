import { combineReducers } from 'redux';
import { reducers as accountListReducers } from './Components/AccountList';
import { reducers as dashboardReducers } from './Components/Dashboard';

const reducers = {
  ForemanRhCloud: combineReducers({
    ...accountListReducers,
    ...dashboardReducers,
  }),
};

export default reducers;
