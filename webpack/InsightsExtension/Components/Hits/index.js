import React from 'react';
import { Battery, Section } from '@redhat-cloud-services/frontend-components';

export default () => (
  <Section type="icon-group">
    <Battery label="test" severity="critical" />
  </Section>
);
