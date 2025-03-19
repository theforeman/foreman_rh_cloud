/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanOrganization } from 'foremanReact/Root/Context/ForemanContext';
import ClearButton from './Components/ClearButton';
import './inventoryFilter.scss';
import { ANY_ORGANIZATION } from './InventoryFilterConstants';

const InventoryFilter = ({
  handleFilterChange,
  handleFilterClear,
  filterTerm,
}) => {
  useEffect(() => {
    const initialTerm = organization === ANY_ORGANIZATION ? '' : organization;
    handleFilterChange(initialTerm);
  }, []);

  const organization = useForemanOrganization()?.title;

  return (
    <form id="inventory_filter_form">
      <FormGroup>
        <TextInput
          id="inventory_filter_input"
          value={filterTerm}
          type="text"
          placeholder={__('Filter..')}
          onChange={(e, v) => handleFilterChange(v)}
        />
        <ClearButton onClear={handleFilterClear} />
      </FormGroup>
    </form>
  );
};

InventoryFilter.propTypes = {
  handleFilterChange: PropTypes.func,
  handleFilterClear: PropTypes.func,
  filterTerm: PropTypes.string,
};

InventoryFilter.defaultProps = {
  handleFilterChange: noop,
  handleFilterClear: noop,
  filterTerm: '',
};

export default InventoryFilter;
