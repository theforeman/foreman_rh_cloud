import { combineReducers } from 'redux';
import inventoryUploadReducers from './ForemanInventoryUpload/ForemanInventoryUploadReducers';

export default {
  ForemanRhCloud: combineReducers({
    ...inventoryUploadReducers,
  }),
};
