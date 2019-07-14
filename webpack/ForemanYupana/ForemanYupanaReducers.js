import { combineReducers } from 'redux';
import { reducers as uploadsDashboardReducers } from './Components/UploadsDashboard';
import { reducers as terminalReducers } from './Components/Terminal';

const reducers = {
  ForemanYupana: combineReducers({
    ...uploadsDashboardReducers,
    ...terminalReducers,
  }),
};

export default reducers;
