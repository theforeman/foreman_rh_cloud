import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import ScheduledRun from '../ScheduledRun';
import './reportGenerate.scss';
import TabBody from '../TabBody';

class ReportGenerate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logs: props.logs };
  }

  componentDidMount() {
    const newLogs = [...this.state.logs];
    setInterval(() => {
      const lastLog = newLogs[newLogs.length - 1];
      const splittedWords = lastLog.split(' ');
      const lastWord = splittedWords.pop();
      let amount;
      let total;
      if (lastWord.includes('/')) {
        const splittedAmounts = lastWord.split('/');
        amount = splittedAmounts[0];
        total = splittedAmounts[1];
      }
      const newLog = `${splittedWords[0]} ${splittedWords[1]} ${Number(amount) +
        1}/${total}`;
      newLogs.push(newLog);
      this.setState({ logs: newLogs });
    }, 1000);
  }
  render() {
    const { exitCode, onRestart, processScheduledTime } = this.props;

    return (
      <TabContainer className="report-generate">
        <TabHeader exitCode={exitCode} onRestart={onRestart} />
        <TabBody logs={this.state.logs} />
        <TabFooter>
          <ScheduledRun time={processScheduledTime} />
        </TabFooter>
      </TabContainer>
    );
  }
}

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logs: PropTypes.arrayOf(PropTypes.string),
  onRestart: PropTypes.func,
  processScheduledTime: PropTypes.string,
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  logs: ['No running process'],
  onRestart: noop,
  processScheduledTime: '00:00',
};

export default ReportGenerate;
