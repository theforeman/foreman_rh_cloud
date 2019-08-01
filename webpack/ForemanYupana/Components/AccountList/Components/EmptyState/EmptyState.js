import React from 'react';
import { EmptyState } from 'patternfly-react';

const yupanaEmptyState = () => (
  <EmptyState>
    <EmptyState.Icon />
    <EmptyState.Title>Fetching data about your accounts</EmptyState.Title>
    <EmptyState.Info>Loading...</EmptyState.Info>
  </EmptyState>
);

export default yupanaEmptyState;
