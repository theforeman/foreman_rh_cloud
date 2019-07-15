import { combineReducers } from 'redux';
import { reducers as uploadsDashboardReducers } from './Components/UploadsDashboard';
import { reducers as reportGenerateReducers } from './Components/ReportGenerate';

const reducers = {
  ForemanYupana: combineReducers({
    ...uploadsDashboardReducers,
    ...reportGenerateReducers,
  }),
};

export default reducers;
