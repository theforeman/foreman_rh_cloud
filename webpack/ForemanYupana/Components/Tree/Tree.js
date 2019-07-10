import React from 'react';
import PropTypes from 'prop-types';
import { default as RATTree } from 'react-animated-tree';
import { Grid } from 'patternfly-react';

const Tree = ({ files }) => {
  const filesAmount = files.length;
  const fileTrees = files.map((file, index) => (
    <RATTree key={index} content={file} />
  ));
  return (
    <Grid.Col sm={9}>
      <p>There are currently {filesAmount} report files ready</p>
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
