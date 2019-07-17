import { DASHBOARD_CHANGE_BOOL } from './DashboardConstants';

export const changeBool = resource => dispatch => {
  dispatch({
    type: DASHBOARD_CHANGE_BOOL,
    payload: resource,
  });
};
