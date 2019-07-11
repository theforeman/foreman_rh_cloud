import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectUploadsDashboard = state =>
  selectForemanYupana(state).uploadsDashboard;

export const selectBool = state => selectUploadsDashboard(state).bool;
