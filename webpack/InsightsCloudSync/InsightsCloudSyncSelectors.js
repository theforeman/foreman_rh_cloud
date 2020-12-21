import URI from 'urijs';
import { selectRouterLocation } from 'foremanReact/routes/RouterSelector';

export const selectQuery = state => selectRouterLocation(state).query;

export const selectSearch = state => {
  const { search = '' } = selectQuery(state);
  return URI.decodeQuery(search);
};

export const selectPage = state => {
  const { page = '1' } = selectQuery(state);
  return Number(page);
};

export const selectPerPage = state => {
  const perPage = selectQuery(state).per_page;
  return perPage && Number(perPage);
};

export const selectQueryParams = state => ({
  page: selectPage(state),
  perPage: selectPerPage(state),
  searchQuery: selectSearch(state),
});
