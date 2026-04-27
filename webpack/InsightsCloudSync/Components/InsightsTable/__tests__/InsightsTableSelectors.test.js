import { insightsStateWrapper } from '../../../../ForemanRhCloudTestHelpers';
import { routerState, APIState, APIErrorState, hits } from './fixtures';
import {
  selectError,
  selectHits,
  selectInsightsCloudTable,
  selectIsAllSelected,
  selectItemCount,
  selectPage,
  selectPerPage,
  selectQuery,
  selectQueryParams,
  selectSearch,
  selectSelectedIds,
  selectShowSelectAllAlert,
  selectSortBy,
  selectSortOrder,
  selectStatus,
} from '../InsightsTableSelectors';

const state = {
  ...routerState,
  ...APIState,
  ...insightsStateWrapper({
    table: {
      selectedIds: { '51': true },
      showSelectAllAlert: true,
      isAllSelected: false,
    },
  }),
};

describe('InsightsTable selectors', () => {
  describe('router query selectors', () => {
    it('selectQuery returns the query object', () => {
      expect(selectQuery(state)).toEqual(routerState.router.location.query);
    });

    it('selectSearch returns URI-decoded search string', () => {
      expect(selectSearch(state)).toBe('total_risk < 3');
    });

    it('selectPage returns the page as a number', () => {
      expect(selectPage(state)).toBe(1);
    });

    it('selectPerPage returns per_page as a number', () => {
      expect(selectPerPage(state)).toBe(7);
    });

    it('selectSortBy returns the sort_by value', () => {
      expect(selectSortBy(state)).toBe('total_risk');
    });

    it('selectSortOrder returns the sort_order value', () => {
      expect(selectSortOrder(state)).toBe('asc');
    });

    it('selectQueryParams returns aggregated params object', () => {
      const params = selectQueryParams(state);
      expect(params.page).toBe(1);
      expect(params.perPage).toBe(7);
      expect(params.query).toBe('total_risk < 3');
      expect(params.sortBy).toBe('total_risk');
      expect(params.sortOrder).toBe('asc');
    });
  });

  describe('API selectors', () => {
    it('selectStatus returns API status', () => {
      expect(selectStatus(state)).toBe('RESOLVED');
    });

    it('selectError returns error message from error state', () => {
      const errorState = { ...state, ...APIErrorState };
      expect(selectError(errorState)).toBeTruthy();
    });

    it('selectHits returns hits when status is RESOLVED', () => {
      expect(selectHits(state)).toHaveLength(2);
    });

    it('selectHits returns empty array when status is not RESOLVED', () => {
      const pendingState = {
        ...state,
        API: {
          INSIGHTS_HITS: {
            ...state.API.INSIGHTS_HITS,
            status: 'PENDING',
          },
        },
      };
      expect(selectHits(pendingState)).toEqual([]);
    });

    it('selectItemCount returns the item count', () => {
      expect(selectItemCount(state)).toBe(2);
    });
  });

  describe('table state selectors', () => {
    it('selectInsightsCloudTable returns the table sub-state', () => {
      expect(selectInsightsCloudTable(state)).toEqual({
        selectedIds: { '51': true },
        showSelectAllAlert: true,
        isAllSelected: false,
      });
    });

    it('selectSelectedIds returns selected IDs', () => {
      expect(selectSelectedIds(state)).toEqual({ '51': true });
    });

    it('selectIsAllSelected returns false', () => {
      expect(selectIsAllSelected(state)).toBe(false);
    });

    it('selectShowSelectAllAlert returns true', () => {
      expect(selectShowSelectAllAlert(state)).toBe(true);
    });
  });
});
