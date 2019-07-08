import { combineReducers } from 'redux';
import { reducers as tasksDashboardReducers } from './Components/TasksDashboard';

const reducers = {
  ForemanYupana: combineReducers({
    ...tasksDashboardReducers,
  }),
};

export default reducers;
