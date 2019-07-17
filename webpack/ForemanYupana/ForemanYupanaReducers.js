import { combineReducers } from 'redux';
import { reducers as reportGenerateReducers } from './Components/ReportGenerate';

const reducers = {
  ForemanYupana: combineReducers({
    ...reportGenerateReducers,
  }),
};

export default reducers;
