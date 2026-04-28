import { push } from 'connected-react-router';
import {
  fetchInsights,
  setSelectAllAlert,
  selectByIds,
  setSelectAll,
  selectAll,
  clearAllSelection,
} from '../InsightsTableActions';
import {
  INSIGHTS_SET_SELECTED_IDS,
  INSIGHTS_SET_SELECT_ALL_ALERT,
  INSIGHTS_SET_SELECT_ALL,
  INSIGHTS_HITS_API_KEY,
  INSIGHTS_HITS_PATH,
} from '../InsightsTableConstants';
import { hits } from './fixtures';

jest.mock('connected-react-router', () => ({
  push: jest.fn(args => ({ type: '@@router/CALL_HISTORY_METHOD', payload: args })),
}));

const buildGetState = (queryOverrides = {}) => () => ({
  router: {
    location: {
      query: {
        page: '1',
        per_page: '7',
        search: '',
        sort_by: '',
        sort_order: '',
        select_all: 'false',
        ...queryOverrides,
      },
    },
  },
});

describe('InsightsTable actions', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.clearAllMocks();
  });

  describe('plain action creators', () => {
    it('setSelectAllAlert returns correct action', () => {
      expect(setSelectAllAlert(true)).toEqual({
        type: INSIGHTS_SET_SELECT_ALL_ALERT,
        payload: { showSelectAllAlert: true },
      });
    });

    it('selectByIds returns correct action', () => {
      const ids = { 1: true, 5: true };
      expect(selectByIds(ids)).toEqual({
        type: INSIGHTS_SET_SELECTED_IDS,
        payload: { selectedIds: ids },
      });
    });
  });

  describe('setSelectAll', () => {
    it('dispatches select all action and url update', () => {
      setSelectAll(false)(dispatch);

      const dispatched = dispatch.mock.calls.map(c => c[0]);
      const selectAllAction = dispatched.find(
        a => a && a.type === INSIGHTS_SET_SELECT_ALL
      );
      expect(selectAllAction).toBeTruthy();
      expect(selectAllAction.payload).toEqual({ isAllSelected: false });
    });
  });

  describe('selectAll', () => {
    it('dispatches setSelectAll with true', () => {
      selectAll()(dispatch);

      const dispatched = dispatch.mock.calls.map(c => c[0]);
      const selectAllAction = dispatched.find(
        a => a && a.type === INSIGHTS_SET_SELECT_ALL
      );
      expect(selectAllAction).toBeTruthy();
      expect(selectAllAction.payload).toEqual({ isAllSelected: true });
    });
  });

  describe('clearAllSelection', () => {
    it('dispatches reset ids, clear alert, and deselect all', () => {
      clearAllSelection()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: INSIGHTS_SET_SELECTED_IDS,
          payload: { selectedIds: {} },
        })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: INSIGHTS_SET_SELECT_ALL_ALERT,
          payload: { showSelectAllAlert: false },
        })
      );
    });
  });

  describe('fetchInsights', () => {
    it('dispatches url push and API get with correct params', () => {
      const getState = buildGetState();

      fetchInsights({ page: 2, perPage: 7 })(dispatch, getState);

      expect(push).toHaveBeenCalled();

      const apiAction = dispatch.mock.calls.find(
        call => call[0] && call[0].key === INSIGHTS_HITS_API_KEY
      );
      expect(apiAction).toBeTruthy();
      const getArg = apiAction[0];
      expect(getArg.url).toBe(INSIGHTS_HITS_PATH);
      expect(getArg.params.page).toBe(2);
      expect(getArg.params.per_page).toBe(7);
    });

    it('clears select all alert when isSelectAll is false', () => {
      const getState = buildGetState({ select_all: 'false' });

      fetchInsights({})(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: INSIGHTS_SET_SELECT_ALL_ALERT,
          payload: { showSelectAllAlert: false },
        })
      );
    });
  });
});
