import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, noop } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import ClearButton from './Components/ClearButton';
import './inventoryFilter.scss';

class InventoryFilter extends React.Component {
  componentDidMount() {
    const { handleFilterChange, initialValue } = this.props;
    handleFilterChange(initialValue);
  }

  render() {
    const { handleFilterChange, handleFilterClear, filterTerm } = this.props;

    return (
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
  }
}

InventoryFilter.propTypes = {
  handleFilterChange: PropTypes.func,
  handleFilterClear: PropTypes.func,
  filterTerm: PropTypes.string,
  initialValue: PropTypes.string,
};

InventoryFilter.defaultProps = {
  handleFilterChange: noop,
  handleFilterClear: noop,
  filterTerm: '',
  initialValue: '',
};

export default InventoryFilter;
