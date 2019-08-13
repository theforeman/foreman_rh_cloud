import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'patternfly-react';
import './errorState.scss';

const ErrorState = ({ error }) => (
  <div className="error_state">
    <Icon className="error_icon" name="times" size="3x" />
    <p>Encountered an error while trying to access the server:</p>
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
