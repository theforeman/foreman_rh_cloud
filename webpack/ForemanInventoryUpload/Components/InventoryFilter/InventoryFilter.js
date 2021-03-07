import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl } from 'patternfly-react';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import ClearButton from './Components/ClearButton';
import './inventoryFilter.scss';

const InventoryFilter = ({
  handleFilterChange,
  handleFilterClear,
  filterTerm,
}) => (
  <form id="inventory_filter_form">
    <FormGroup controlId="inventory_filter_input">
      <FormControl
        value={filterTerm}
        type="text"
        placeholder={__('Filter..')}
        bsSize="lg"
        onChange={e => handleFilterChange(e.target.value)}
      />
      <ClearButton onClear={handleFilterClear} />
    </FormGroup>
  </form>
);

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
