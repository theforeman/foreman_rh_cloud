import { testActionSnapshotWithFixtures } from '@theforeman/test';
import API from 'foremanReact/redux/API';
import {
  fetchInsights,
  setSelectAllAlert,
  selectByIds,
  setSelectAll,
  selectAll,
  clearAllSelection,
} from '../InsightsTableActions';
import { hits } from './fixtures';

jest.mock('foremanReact/redux/API', () => jest.fn());
API.get = jest.fn(({ handleSuccess, ...action }) => {
  handleSuccess({ data: { hits } });
  return { type: 'get', ...action };
});

const runWithGetState = (state, action, params) => dispatch => {
  const getState = () => ({
    router: {
      location: {
        query: {
          page: '1',
          per_page: '7',
          search: '',
          sort_by: '',
          sort_order: '',
          select_all: 'true',
        },
      },
    },
  });
  action(params)(dispatch, getState);
};

const fixtures = {
  'should fetchInsights': () =>
    runWithGetState({}, fetchInsights, { page: 2, perPage: 7 }),
  'should setSelectAllAlert true': () => setSelectAllAlert(true),
  'should selectByIds': () => selectByIds({ 1: true, 5: true }),
  'should setSelectAll false': () => setSelectAll(false),
  'should selectAll': () => selectAll(),
  'should clearAllSelection': () => clearAllSelection(),
};

describe('insights table actions', () =>
  testActionSnapshotWithFixtures(fixtures));
