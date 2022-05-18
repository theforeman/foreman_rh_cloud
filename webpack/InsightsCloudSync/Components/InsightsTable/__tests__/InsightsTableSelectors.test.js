import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { insightsStateWrapper } from '../../../../ForemanRhCloudTestHelpers';
import { routerState, APIState, APIErrorState } from './fixtures';
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
      selectedIds: {
        '51': true,
      },
      showSelectAllAlert: true,
      isAllSelected: false,
    },
  }),
};

const fixtures = {
  'should return router query': () => selectQuery(state),
  'should return router search': () => selectSearch(state),
  'should return router page': () => selectPage(state),
  'should return router perPage': () => selectPerPage(state),
  'should return router sort by': () => selectSortBy(state),
  'should return router sort order': () => selectSortOrder(state),
  'should return queryParams': () => selectQueryParams(state),
  'should return API status': () => selectStatus(state),
  'should return API error': () => selectError({ ...state, ...APIErrorState }),
  'should return API hits': () => selectHits(state),
  'should return API item count': () => selectItemCount(state),
  'should return insights table': () => selectInsightsCloudTable(state),
  'should return insights selectedIds': () => selectSelectedIds(state),
  'should return insights isAllSelected': () => selectIsAllSelected(state),
  'should return insights showSelectAllAlert': () =>
    selectShowSelectAllAlert(state),
};

describe('InsightsTable selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
