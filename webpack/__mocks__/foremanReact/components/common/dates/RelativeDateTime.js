import React from 'react';
import PropTypes from 'prop-types';

const RelativeDateTime = ({ date }) => <span>{date}</span>;

RelativeDateTime.propTypes = {
  date: PropTypes.string,
};

RelativeDateTime.defaultProps = {
  date: '',
};

export default RelativeDateTime;
