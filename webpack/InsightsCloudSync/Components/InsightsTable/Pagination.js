import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Pagination as PfPagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { onTablePerPageSelect, onTableSetPage } from './InsightsTableActions';
import { getPerPageOptions } from './InsightsTableHelpers';
import {
  selectItemCount,
  selectPage,
  selectPerPage,
} from './InsightsTableSelectors';

const Pagination = ({ variant }) => {
  const dispatch = useDispatch();
  const onSetPage = (e, pageNumber) => dispatch(onTableSetPage(e, pageNumber));
  const onPerPageSelect = (e, perPageNumber) =>
    dispatch(onTablePerPageSelect(e, perPageNumber));
  const itemCount = useSelector(state => selectItemCount(state));
  const urlPerPage = useSelector(state => selectPerPage(state));
  const page = useSelector(state => selectPage(state));
  const { perPage: appPerPage } = useForemanSettings();
  const perPage = urlPerPage || appPerPage;

  return (
    <PfPagination
      itemCount={itemCount}
      widgetId={`recommendation-pagination-${variant}`}
      perPage={perPage}
      page={page}
      variant={PaginationVariant[variant]}
      onSetPage={onSetPage}
      onPerPageSelect={onPerPageSelect}
      perPageOptions={getPerPageOptions(urlPerPage, appPerPage)}
    />
  );
};

Pagination.propTypes = {
  variant: PropTypes.string,
};

Pagination.defaultProps = {
  variant: 'top',
};

export default Pagination;
