import React from 'react';
import PropTypes from 'prop-types';
import { default as RATTree } from 'react-animated-tree';
import { Grid } from 'patternfly-react';

const Tree = ({ files }) => {
  const fileTrees = files.map(file => <RATTree content={file} />);
  return (
    <Grid.Col sm={9}>
      <RATTree content="Reports" open canHide visible>
        {fileTrees}
      </RATTree>
    </Grid.Col>
  );
};

Tree.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string),
};

Tree.defaultProps = {
  files: [],
};

export default Tree;
