import { combineReducers } from 'redux';
import { reducers as uploadsDashboardReducers } from './Components/UploadsDashboard';

const reducers = {
  ForemanYupana: combineReducers({
    ...uploadsDashboardReducers,
  }),
};

export default reducers;
