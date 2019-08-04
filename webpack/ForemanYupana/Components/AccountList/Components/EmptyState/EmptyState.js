import React from 'react';
import { EmptyState, Spinner } from 'patternfly-react';
import './emptyState.scss';

const yupanaEmptyState = () => (
  <EmptyState>
    <Spinner loading inline size="lg" />
    <EmptyState.Title>Fetching data about your accounts</EmptyState.Title>
    <EmptyState.Info>Loading...</EmptyState.Info>
  </EmptyState>
);

export default yupanaEmptyState;
