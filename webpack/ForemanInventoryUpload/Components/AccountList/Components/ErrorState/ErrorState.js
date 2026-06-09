import React from 'react';
import PropTypes from 'prop-types';
import { TimesIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import './errorState.scss';

const ErrorState = ({ error }) => (
  <div className="error_state">
    <TimesIcon className="error_icon" size="xl" />
    <p>{__('Encountered an error while trying to access the server:')}</p>
    <p className="error_description">{error}</p>
  </div>
);

ErrorState.propTypes = {
  error: PropTypes.string,
};

ErrorState.defaultProps = {
  error: '',
};

export default ErrorState;
