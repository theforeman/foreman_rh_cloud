import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectDashboard = state => selectForemanYupana(state).dashboard;
export const selectBool = state => selectDashboard(state).bool;
