import { combineReducers } from 'redux';
import { reducers as reportGenerateReducers } from './Components/ReportGenerate';
import { reducers as reportUploadReducers } from './Components/ReportUpload';

const reducers = {
  ForemanYupana: combineReducers({
    ...reportGenerateReducers,
    ...reportUploadReducers,
  }),
};

export default reducers;
