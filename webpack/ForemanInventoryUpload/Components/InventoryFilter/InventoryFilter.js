/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  InputGroup,
  InputGroupItem,
  Button,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { noop } from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanOrganization } from 'foremanReact/Root/Context/ForemanContext';
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
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              id="inventory_filter_input"
              ouiaId="inventory_filter_input"
              value={filterTerm}
              type="text"
              placeholder={__('Filter..')}
              onChange={(e, v) => handleFilterChange(v)}
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              ouiaId="inventory-filter-clear-button"
              variant="plain"
              aria-label={__('Clear')}
              onClick={handleFilterClear}
            >
              <TimesIcon />
            </Button>
          </InputGroupItem>
        </InputGroup>
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
