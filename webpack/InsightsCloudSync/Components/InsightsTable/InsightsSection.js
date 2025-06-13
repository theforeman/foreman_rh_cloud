import React from 'react';
import PropTypes from 'prop-types';

import './InsightsSection.scss';

const InsightsSection = ({ type, children, className, ...props }) => {
  let sectionClasses = className || '';
  if (type !== undefined) {
    sectionClasses = `${sectionClasses} ins-l-${type}`.trim();
  }

  return (
    <section {...props} className={sectionClasses}>
      {children}
    </section>
  );
};

InsightsSection.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
InsightsSection.defaultProps = {
  type: undefined,
  children: null,
  className: '',
};

export default InsightsSection;
