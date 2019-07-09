import React from 'react';
import { Step as SuiStep } from 'semantic-ui-react';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

const { Content, Title } = SuiStep;

const Step = ({ icon, children, ...props }) => (
  <SuiStep {...props}>
    <Icon name={icon} size="2x" />
    <Content>
      <Title>{children}</Title>
    </Content>
  </SuiStep>
);

Step.propTypes = {
  children: PropTypes.string,
  icon: PropTypes.string,
};

Step.defaultProps = {
  icon: 'some-icon',
  children: null,
};

export default Step;
