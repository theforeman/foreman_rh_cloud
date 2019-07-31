import { ACCOUNTLIST_CHANGE_BOOL } from './AccountListConstants';

export const changeBool = resource => dispatch => {
  dispatch({
    type: ACCOUNTLIST_CHANGE_BOOL,
    payload: resource,
  });
};
