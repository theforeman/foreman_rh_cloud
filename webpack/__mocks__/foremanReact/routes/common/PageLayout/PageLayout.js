import React from 'react';
import { Grid } from 'patternfly-react';
import PropTypes from 'prop-types';

const PageLayout = ({ header, children }) => {
  document.title = header;
  return (
    <Grid fluid>
      <Grid.Row>
        <Grid.Col>
          <h1>{header}</h1>
        </Grid.Col>
      </Grid.Row>
      {children}
    </Grid>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
};

export default PageLayout;
