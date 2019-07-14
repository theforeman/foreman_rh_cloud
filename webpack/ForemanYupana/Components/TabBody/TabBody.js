import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';
import StatusChart from '../StatusChart';

const TabBody = ({ logs }) => {
  const lastLog = logs[logs.length - 1];
  const splittedWords = lastLog.split(' ');
  const lastWord = splittedWords.pop();
  let percentage;
  if (lastWord.includes('/')) {
    const filesAmount = lastWord.split('/');
    percentage = (filesAmount[0] * 100) / filesAmount[1];
  }

  return (
    <Grid.Row>
      <StatusChart percentage={percentage} />
      <Terminal>{logs}</Terminal>
    </Grid.Row>
  );
};

TabBody.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string),
};

TabBody.defaultProps = {
  logs: ['No running process'],
};

export default TabBody;
