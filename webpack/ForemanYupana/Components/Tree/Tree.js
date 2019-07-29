import React from 'react';
import PropTypes from 'prop-types';
import { default as RATTree } from 'react-animated-tree';
import { Grid } from 'patternfly-react';
import './tree.scss';

const Tree = ({ files: { queue, error } }) => {
  if (error !== null) {
    return (
      <Grid.Col sm={9}>
        <p>Tried to get the uploads queue, but instead got:</p>
        <p className="queue_error">{error}</p>
      </Grid.Col>
    );
  }
  const filesAmount = queue.length;
  const fileTrees = queue.map((file, index) => (
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
  files: PropTypes.shape({
    queue: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.string,
  }),
};

Tree.defaultProps = {
  files: {
    queue: [],
    error: null,
  },
};

export default Tree;
