import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Pagination as PfPagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { onTablePerPageSelect, onTableSetPage } from './InsightsTableActions';
import { getPerPageOptions } from './InsightsTableHelpers';
import {
  selectItemCount,
  selectPage,
  selectPerPage,
} from './InsightsTableSelectors';

const paginationTitles = {
  items: __('items'),
  page: '', // doesn't work well with translations as it adds 's' for plural, see: https://github.com/patternfly/patternfly-react/issues/6707
  itemsPerPage: __('Items per page'),
  perPageSuffix: __('per page'),
  toFirstPageAriaLabel: __('Go to first page'),
  toPreviousPageAriaLabel: __('Go to previous page'),
  toLastPageAriaLabel: __('Go to last page'),
  toNextPageAriaLabel: __('Go to next page'),
  optionsToggleAriaLabel: __('Items per page'),
  currPageAriaLabel: __('Current page'),
  paginationAriaLabel: __('Pagination'),
};

const Pagination = ({ variant, ...props }) => {
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
      titles={paginationTitles}
      {...props}
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
