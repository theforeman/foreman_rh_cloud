import { UPLOADSDASHBOARD_CHANGE_BOOL } from './UploadsDashboardConstants';

export const changeBool = resource => dispatch => {
  dispatch({
    type: UPLOADSDASHBOARD_CHANGE_BOOL,
    payload: resource,
  });
};
