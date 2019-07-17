import { combineReducers } from 'redux';
import { reducers as reportGenerateReducers } from './Components/ReportGenerate';
import { reducers as reportUploadReducers } from './Components/ReportUpload';
import { reducers as dashboardReducers } from './Components/Dashboard';

const reducers = {
  ForemanYupana: combineReducers({
    ...dashboardReducers,
    ...reportGenerateReducers,
    ...reportUploadReducers,
  }),
};

export default reducers;
