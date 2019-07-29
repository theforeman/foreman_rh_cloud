import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid, noop } from 'patternfly-react';
import './tree.scss';

const Tree = ({ files: { queue, error }, itemDownload }) => {
  if (error !== null) {
    return (
      <Grid.Col sm={9}>
        <p>Tried to get the uploads queue, but instead got:</p>
        <p className="queue_error">{error}</p>
      </Grid.Col>
    );
  }
  const filesAmount = queue.length;
  const queueTree = queue.map((file, index) => (
    <div className="item" key={index}>
      <Icon name="download" onClick={() => itemDownload(file)} />
      {file}
    </div>
  ));
  return (
    <Grid.Col sm={9}>
      <p>There are currently {filesAmount} report files ready</p>
      <div className="reports_queue">{queueTree}</div>
    </Grid.Col>
  );
};

Tree.propTypes = {
  files: PropTypes.shape({
    queue: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.string,
  }),
  itemDownload: PropTypes.func,
};

Tree.defaultProps = {
  files: {
    queue: [],
    error: null,
  },
  itemDownload: noop,
};

export default Tree;
